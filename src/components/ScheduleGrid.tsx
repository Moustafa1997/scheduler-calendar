import React, { useEffect } from 'react';
import { Clock, Users, MapPin, Plus, Sparkles, Bell, Zap } from 'lucide-react';
import { Worker, Shift, DragState, DragPreview, AssignmentData } from '../types/scheduler';
import { getCellWidth, getCurrentTimePosition, getTimeSlotBackground, getShiftColor, timeSlots } from '../utils/schedulerUtils';

interface ScheduleGridProps {
  filteredData: Worker[];
  timelineView: string;
  timeHeaderRef: React.RefObject<HTMLDivElement>;
  scheduleBodyRef: React.RefObject<HTMLDivElement>;
  currentTime: Date;
  selectedBy: string;
  getShiftsForTime: (itemId: number, time: string) => Shift[];
  handleShiftClick: (shift: Shift) => void;
  hoveredShift: number | null;
  setHoveredShift: (id: number | null) => void;
  hoveredCell: string | null;
  setHoveredCell: (cell: string | null) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  dragStart: DragState | null;
  setDragStart: (state: DragState | null) => void;
  dragEnd: DragState | null;
  setDragEnd: (state: DragState | null) => void;
  dragPreview: DragPreview | null;
  setDragPreview: (preview: DragPreview | null) => void;
  setEditingShift: (shift: Shift | null) => void;
  setAssignmentData: (data: AssignmentData) => void;
  setShowAssignModal: (show: boolean) => void;
  workers: Worker[];
  showGridLines: boolean;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  filteredData,
  timelineView,
  timeHeaderRef,
  scheduleBodyRef,
  currentTime,
  selectedBy,
  getShiftsForTime,
  handleShiftClick,
  hoveredShift,
  setHoveredShift,
  hoveredCell,
  setHoveredCell,
  isDragging,
  setIsDragging,
  dragStart,
  setDragStart,
  dragEnd,
  setDragEnd,
  dragPreview,
  setDragPreview,
  setEditingShift,
  setAssignmentData,
  setShowAssignModal,
  workers,
  showGridLines,
}) => {
  // Enhanced synchronized scrolling for timeline
  useEffect(() => {
    const timeHeader = timeHeaderRef.current;
    const scheduleBody = scheduleBodyRef.current;

    if (!timeHeader || !scheduleBody) return;

    let isScrolling = false;

    const syncScrollFromHeader = () => {
      if (isScrolling) return;
      isScrolling = true;
      scheduleBody.scrollLeft = timeHeader.scrollLeft;
      requestAnimationFrame(() => {
        isScrolling = false;
      });
    };

    const syncScrollFromBody = () => {
      if (isScrolling) return;
      isScrolling = true;
      timeHeader.scrollLeft = scheduleBody.scrollLeft;
      requestAnimationFrame(() => {
        isScrolling = false;
      });
    };

    timeHeader.addEventListener('scroll', syncScrollFromHeader, { passive: true });
    scheduleBody.addEventListener('scroll', syncScrollFromBody, { passive: true });

    return () => {
      timeHeader.removeEventListener('scroll', syncScrollFromHeader);
      scheduleBody.removeEventListener('scroll', syncScrollFromBody);
    };
  }, []);

  // Drag and drop handlers
  const handleMouseDown = (item: Worker, time: string, event: React.MouseEvent) => {
    event.preventDefault();
    const cellWidth = getCellWidth(timelineView);
    const timeIndex = timeSlots.indexOf(time);
    
    setIsDragging(true);
    setDragStart({ item, time, timeIndex, x: event.clientX });
    setDragEnd({ item, time, timeIndex, x: event.clientX });
    
    setDragPreview({
      item,
      startTime: time,
      endTime: time,
      width: cellWidth,
      left: timeIndex * cellWidth
    });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging || !dragStart) return;
    
    const cellWidth = getCellWidth(timelineView);
    const deltaX = event.clientX - dragStart.x;
    const cellsDelta = Math.round(deltaX / cellWidth);
    const newTimeIndex = Math.max(0, Math.min(23, dragStart.timeIndex + cellsDelta));
    const newTime = timeSlots[newTimeIndex];
    
    setDragEnd({ 
      item: dragStart.item, 
      time: newTime, 
      timeIndex: newTimeIndex, 
      x: event.clientX 
    });
    
    const startIndex = Math.min(dragStart.timeIndex, newTimeIndex);
    const endIndex = Math.max(dragStart.timeIndex, newTimeIndex);
    const width = (endIndex - startIndex + 1) * cellWidth;
    
    setDragPreview({
      item: dragStart.item,
      startTime: timeSlots[startIndex],
      endTime: timeSlots[endIndex + 1] || '23:59',
      width,
      left: startIndex * cellWidth
    });
  };

  const handleMouseUp = () => {
    if (!isDragging || !dragStart || !dragEnd) return;
    
    const startIndex = Math.min(dragStart.timeIndex, dragEnd.timeIndex);
    const endIndex = Math.max(dragStart.timeIndex, dragEnd.timeIndex);
    const startTime = timeSlots[startIndex];
    const endTime = timeSlots[endIndex + 1] || '23:59';
    
    setEditingShift(null);
    
    if (selectedBy === 'Worker') {
      setAssignmentData({
        worker: dragStart.item.name,
        serviceClient: '',
        shiftType: '',
        requiredRole: '',
        startTime: startTime,
        endTime: endTime,
        date: new Date(),
        status: 'covered'
      });
    } else {
      setAssignmentData({
        worker: '',
        serviceClient: dragStart.item.name,
        shiftType: '',
        requiredRole: selectedBy === 'Client' ? '' : '',
        startTime: startTime,
        endTime: endTime,
        date: new Date(),
        status: 'covered'
      });
    }
    
    setShowAssignModal(true);
    
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
    setDragPreview(null);
  };

  // Add global mouse event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="flex-1 p-2 sm:p-4 lg:p-6 overflow-hidden">
        <div className="bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden h-full flex flex-col">
          
          {/* Sticky Time Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 z-20">
            <div className="flex">
              <div className="w-32 sm:w-48 lg:w-64 px-2 sm:px-4 py-2 sm:py-4 border-r border-gray-200/50 bg-white/80 flex-shrink-0">
                <span className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1 sm:gap-2">
                  {selectedBy === 'Worker' ? (
                    <>
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Workers</span>
                      <span className="sm:hidden">Work</span>
                    </>
                  ) : selectedBy === 'Client' ? (
                    <>
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Clients</span>
                      <span className="sm:hidden">Client</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden lg:inline">Services & Clients</span>
                      <span className="lg:hidden hidden sm:inline">Services</span>
                      <span className="sm:hidden">Serv</span>
                    </>
                  )}
                </span>
              </div>
              <div 
                className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-w-0 scroll-smooth" 
                ref={timeHeaderRef}
              >
                {timeSlots.map((time, index) => {
                  const hour = parseInt(time.split(':')[0]);
                  const isCurrentHour = hour === currentTime.getHours();
                  
                  return (
                    <div
                      key={time}
                      className={`
                        px-1 sm:px-2 py-2 sm:py-4 border-r border-gray-200/50 text-center flex-shrink-0 relative
                        ${getTimeSlotBackground(time)}
                        ${isCurrentHour ? 'bg-red-50/70 border-red-300' : ''}
                      `}
                      style={{ width: `${getCellWidth(timelineView)}px` }}
                    >
                      <div className={`text-xs font-medium ${isCurrentHour ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                        {time}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 hidden sm:block">
                        {hour >= 6 && hour < 12 ? '🌅' : hour >= 12 && hour < 18 ? '☀️' : hour >= 18 && hour < 24 ? '🌙' : '🌃'}
                      </div>
                      {isCurrentHour && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Schedule Rows */}
          <div className="flex-1 overflow-hidden relative">
            <div className="h-full flex flex-col">
              <div 
                className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
                ref={scheduleBodyRef}
              >
                <div className="relative select-none">
                  {/* Current time line */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-red-500 z-10 pointer-events-none"
                    style={{ 
                      left: `${(window.innerWidth < 640 ? 128 : window.innerWidth < 1024 ? 192 : 256) + getCurrentTimePosition(timelineView)}px`,
                    }}
                  >
                    <div className="absolute -top-2 -left-3 w-6 h-6 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                      <Clock className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  {filteredData.map((item, rowIndex) => (
                    <div key={item.id} className={`flex border-b border-gray-200/50 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-cyan-50/50 transition-all ${rowIndex % 2 === 0 ? 'bg-gray-50/30' : 'bg-white/30'}`}
                      style={{ minHeight: timelineView === 'expanded' ? '100px' : timelineView === 'compact' ? '60px' : '80px' }}>
                      <div className="w-32 sm:w-48 lg:w-64 px-2 sm:px-4 py-3 sm:py-6 border-r border-gray-200/50 bg-white/60 sticky left-0 z-10 flex-shrink-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg transform hover:scale-110 transition-transform">
                            {item.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{item.name}</div>
                            <div className="text-xs text-gray-500 truncate hidden sm:block">{item.email}</div>
                            <div className="flex items-center gap-1 sm:gap-2 mt-1">
                              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse`}></div>
                              <span className="text-xs text-gray-600">{item.role}</span>
                            </div>
                            {timelineView === 'expanded' && item.address && (
                              <div className="text-xs text-gray-400 truncate mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {item.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex relative min-w-max">
                        {timeSlots.map((time, timeIndex) => {
                          const shiftsAtTime = getShiftsForTime(item.id, time);
                          const hasShift = shiftsAtTime.length > 0;
                          const cellKey = `${item.id}-${time}`;
                          const hour = parseInt(time.split(':')[0]);
                          const isCurrentHour = hour === currentTime.getHours();
                          
                          if (hasShift) {
                            return shiftsAtTime.map((shift, index) => {
                              const isStartTime = shift.startTime === time;
                              if (!isStartTime) return null;
                              
                              const shiftStart = parseInt(shift.startTime.split(':')[0]);
                              const shiftEnd = parseInt(shift.endTime.split(':')[0]);
                              const shiftDuration = shiftEnd > shiftStart ? shiftEnd - shiftStart : (24 - shiftStart) + shiftEnd;
                              const cellWidth = getCellWidth(timelineView);
                              
                              return (
                                <div
                                  key={`${time}-${shift.id}`}
                                  className={`
                                    absolute px-1 sm:px-2 lg:px-3 py-1 sm:py-2 text-xs rounded-lg sm:rounded-xl cursor-pointer
                                    transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:z-20
                                    ${getShiftColor(shift.status)} text-white font-medium
                                    border-2 border-white/30
                                  `}
                                  style={{
                                    left: `${shiftStart * cellWidth}px`,
                                    width: `${shiftDuration * cellWidth - 4}px`,
                                    top: `${8 + index * 24}px`,
                                    height: timelineView === 'expanded' ? '80px' : timelineView === 'compact' ? '48px' : '64px',
                                    zIndex: hoveredShift === shift.id ? 15 : 3
                                  }}
                                  onMouseEnter={() => setHoveredShift(shift.id)}
                                  onMouseLeave={() => setHoveredShift(null)}
                                  onClick={() => handleShiftClick(shift)}
                                >
                                  <div className="h-full flex flex-col justify-between p-1">
                                    <div className="font-bold truncate text-xs flex items-center gap-1">
                                      {shift.type}
                                      {shift.status === 'uncovered' && <Bell className="w-3 h-3 animate-bounce" />}
                                    </div>
                                    
                                    <div className="text-xs opacity-90 truncate flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {shift.startTime} - {shift.endTime}
                                    </div>
                                    
                                    {timelineView !== 'compact' && (
                                      <div className="text-xs truncate mt-1 opacity-80 flex items-center gap-1">
                                        {selectedBy === 'Worker' ? (
                                          <>
                                            <MapPin className="w-3 h-3" />
                                            {shift.serviceClient}
                                          </>
                                        ) : (
                                          <>
                                            <Users className="w-3 h-3" />
                                            {shift.workerName || 'Unassigned'}
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  
                                  {hoveredShift === shift.id && (
                                    <div className="fixed z-[100] p-3 sm:p-4 bg-gray-900/95 backdrop-blur-xl text-white rounded-xl shadow-2xl w-64 sm:w-80 border border-gray-700 pointer-events-none"
                                      style={{
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)'
                                      }}
                                    >
                                      <div className="text-sm sm:text-base font-bold mb-2 sm:mb-3 text-teal-300">{shift.type}</div>
                                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-300">Time:</span>
                                          <span className="font-medium">{shift.startTime} - {shift.endTime}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-300">Duration:</span>
                                          <span className="font-medium">{shiftDuration} hours</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-300">Status:</span>
                                          <span className={`font-medium ${shift.status === 'covered' ? 'text-green-300' : 'text-red-300'}`}>
                                            {shift.status}
                                          </span>
                                        </div>
                                        {shift.serviceClient && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-300">Service/Client:</span>
                                            <span className="font-medium">{shift.serviceClient}</span>
                                          </div>
                                        )}
                                        {shift.workerName && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-300">Worker:</span>
                                            <span className="font-medium">{shift.workerName}</span>
                                          </div>
                                        )}
                                        {(() => {
                                          const location = workers.find(w => w.name === shift.serviceClient || w.name === shift.workerName);
                                          return location?.address ? (
                                            <div className="pt-2 border-t border-gray-700">
                                              <div className="flex items-start gap-2">
                                                <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                                                <div>
                                                  <span className="text-gray-300 text-xs">Location:</span>
                                                  <p className="text-xs mt-0.5">{location.address}</p>
                                                </div>
                                              </div>
                                            </div>
                                          ) : null;
                                        })()}
                                        {shift.notes && (
                                          <div className="pt-2 border-t border-gray-700">
                                            <span className="text-gray-300">Notes:</span>
                                            <p className="text-xs mt-1">{shift.notes}</p>
                                          </div>
                                        )}
                                        <div className="pt-1 sm:pt-2 mt-2 sm:mt-3 border-t border-gray-700 text-xs text-gray-400">
                                          Click to edit shift details
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            });
                          } else {
                            const cellWidth = getCellWidth(timelineView);
                            return (
                              <div
                                key={cellKey}
                                onMouseDown={(e) => handleMouseDown(item, time, e)}
                                onMouseEnter={() => setHoveredCell(cellKey)}
                                onMouseLeave={() => setHoveredCell(null)}
                                className={`
                                  border-r border-gray-200/50 transition-all relative group flex-shrink-0 cursor-crosshair
                                  ${getTimeSlotBackground(time)}
                                  ${isCurrentHour ? 'bg-red-50/50 border-red-200' : ''}
                                  hover:bg-gradient-to-br hover:from-teal-100/50 hover:to-cyan-100/50
                                `}
                                style={{ 
                                  width: `${cellWidth}px`,
                                  height: timelineView === 'expanded' ? '100px' : timelineView === 'compact' ? '60px' : '80px'
                                }}
                              >
                                {showGridLines && timeIndex % 3 === 0 && (
                                  <div className="absolute inset-0 border-l-2 border-gray-300/30 pointer-events-none"></div>
                                )}
                                
                                <div className={`
                                  absolute inset-0 flex items-center justify-center
                                  transition-all duration-500 ease-out
                                  ${hoveredCell === cellKey ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                                `}>
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:rotate-180 group-hover:scale-110">
                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white" />
                                  </div>
                                </div>
                                
                                {hoveredCell === cellKey && (
                                  <Sparkles className="absolute top-1 right-1 w-3 h-3 text-yellow-400 animate-pulse" />
                                )}
                              </div>
                            );
                          }
                        })}
                        
                        {isDragging && dragPreview && dragPreview.item.id === item.id && (
                          <div
                            className="absolute h-10 sm:h-12 lg:h-16 bg-gradient-to-r from-blue-500/70 to-purple-600/70 rounded-lg border-2 border-blue-400 pointer-events-none z-20 backdrop-blur-sm"
                            style={{
                              left: `${dragPreview.left}px`,
                              width: `${dragPreview.width}px`,
                              top: '8px'
                            }}
                          >
                            <div className="p-1 sm:p-2 text-white text-xs font-bold flex items-center gap-2">
                              <Zap className="w-3 h-3 animate-pulse" />
                              {dragPreview.startTime} - {dragPreview.endTime}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGrid;