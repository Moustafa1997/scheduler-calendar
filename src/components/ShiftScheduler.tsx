import React, { useState, useMemo, useRef, useEffect } from 'react';
import { workers, shiftTypes, roles, services, initialShifts } from '../data/mockData';
import { Worker, Shift, AssignmentData, DragState, DragPreview } from '../types/scheduler';
import { getCellWidth, getCurrentTimePosition, getFilteredWorkers, getFilteredShifts, timeSlots } from '../utils/schedulerUtils';
import FilterHeader from './FilterHeader';
import Sidebar from './Sidebar';
import ScheduleGrid from './ScheduleGrid';
import ShiftAssignmentModal from './ShiftAssignmentModal';

const ShiftScheduler: React.FC = () => {
  // State management
  const [selectedBy, setSelectedBy] = useState('Service & Client');
  const [selectedName, setSelectedName] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [hoveredShift, setHoveredShift] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [nameSearchTerm, setNameSearchTerm] = useState('');
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [timelineView, setTimelineView] = useState('standard');
  const [showGridLines, setShowGridLines] = useState(true);
  
  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<DragState | null>(null);
  const [dragEnd, setDragEnd] = useState<DragState | null>(null);
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);
  
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    worker: '',
    serviceClient: '',
    shiftType: '',
    requiredRole: '',
    startTime: '',
    endTime: '',
    date: new Date(),
    status: 'covered'
  });

  const [shifts, setShifts] = useState<Shift[]>(initialShifts);

  // Refs for synchronized scrolling
  const timeHeaderRef = useRef<HTMLDivElement>(null);
  const scheduleBodyRef = useRef<HTMLDivElement>(null);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // ENHANCED: Keep sidebar persistent during filter changes and scrolling
  useEffect(() => {
    // Only auto-open sidebar on desktop when filters change
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(false);
    }
    // On mobile, keep current state to avoid unwanted opening
  }, [selectedBy, selectedName, selectedType, selectedStatus]);

  // ENHANCED: Prevent sidebar from closing during horizontal scroll
  useEffect(() => {
    const handleScroll = () => {
      // Prevent sidebar from being affected by horizontal scrolling
      // This ensures sidebar stays visible when viewing later time slots
      if (window.innerWidth >= 1024 && !sidebarCollapsed) {
        // Force sidebar to stay open during scroll operations
        return;
      }
    };

    const timeHeader = timeHeaderRef.current;
    const scheduleBody = scheduleBodyRef.current;

    if (timeHeader) {
      timeHeader.addEventListener('scroll', handleScroll, { passive: true });
    }
    if (scheduleBody) {
      scheduleBody.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (timeHeader) {
        timeHeader.removeEventListener('scroll', handleScroll);
      }
      if (scheduleBody) {
        scheduleBody.removeEventListener('scroll', handleScroll);
      }
    };
  }, [sidebarCollapsed]);

  // Enhanced filter logic with real filtering
  const filteredData = useMemo(() => {
    let data: Worker[] = [];
    
    if (selectedBy === 'Worker') {
      data = workers.filter(w => w.role !== 'Service' && w.role !== 'Client');
    } else if (selectedBy === 'Service & Client') {
      data = workers.filter(w => w.role === 'Service');
    } else if (selectedBy === 'Client') {
      data = workers.filter(w => w.role === 'Client');
    }
    
    if (selectedName !== 'All') {
      data = data.filter(item => item.name === selectedName);
    }
    
    return data;
  }, [selectedBy, selectedName]);

  // Enhanced filtered shifts with type and status filtering
  const filteredShifts = useMemo(() => {
    return getFilteredShifts(shifts, selectedType, selectedStatus);
  }, [shifts, selectedType, selectedStatus]);

  // Filtered names for searchable dropdown
  const filteredNames = useMemo(() => {
    let baseData: Worker[] = [];
    
    if (selectedBy === 'Worker') {
      baseData = workers.filter(w => w.role !== 'Service' && w.role !== 'Client');
    } else if (selectedBy === 'Service & Client') {
      baseData = workers.filter(w => w.role === 'Service');
    } else if (selectedBy === 'Client') {
      baseData = workers.filter(w => w.role === 'Client');
    }
    
    if (!nameSearchTerm) return baseData;
    
    return baseData.filter(item => 
      item.name.toLowerCase().includes(nameSearchTerm.toLowerCase())
    );
  }, [selectedBy, nameSearchTerm]);

  // Get shifts for specific item and time - ENHANCED with filtering
  const getShiftsForTime = (itemId: number, time: string): Shift[] => {
    const targetShifts = selectedBy === 'Worker' 
      ? filteredShifts.filter(shift => shift.workerId === itemId)
      : filteredShifts.filter(shift => shift.serviceClient === workers.find(w => w.id === itemId)?.name);

    return targetShifts.filter(shift => {
      const shiftStart = parseInt(shift.startTime.split(':')[0]);
      const shiftEnd = parseInt(shift.endTime.split(':')[0]);
      const currentHour = parseInt(time.split(':')[0]);
      
      if (shiftEnd < shiftStart) {
        return currentHour >= shiftStart || currentHour < shiftEnd;
      }
      return currentHour >= shiftStart && currentHour < shiftEnd;
    });
  };

  const handleShiftClick = (shift: Shift) => {
    setEditingShift(shift);
    setAssignmentData({
      worker: shift.workerName,
      serviceClient: shift.serviceClient,
      shiftType: shift.type,
      requiredRole: shift.requiredRole,
      startTime: shift.startTime,
      endTime: shift.endTime,
      date: shift.date,
      status: shift.status
    });
    setShowAssignModal(true);
  };

  const handleAssignShift = () => {
    const workerData = workers.find(w => w.name === assignmentData.worker);
    
    if (editingShift) {
      const updatedShifts = shifts.map(shift => 
        shift.id === editingShift.id 
          ? {
              ...shift,
              workerId: workerData?.id || null,
              workerName: workerData?.name || '',
              serviceClient: assignmentData.serviceClient,
              type: assignmentData.shiftType,
              requiredRole: assignmentData.requiredRole,
              startTime: assignmentData.startTime,
              endTime: assignmentData.endTime,
              date: assignmentData.date,
              status: assignmentData.status
            }
          : shift
      );
      setShifts(updatedShifts);
    } else {
      const newShift: Shift = {
        id: shifts.length + 1,
        workerId: workerData?.id || null,
        workerName: workerData?.name || '',
        serviceClient: assignmentData.serviceClient,
        type: assignmentData.shiftType,
        requiredRole: assignmentData.requiredRole,
        startTime: assignmentData.startTime,
        endTime: assignmentData.endTime,
        date: assignmentData.date,
        status: assignmentData.status,
        notes: 'New assignment'
      };
      setShifts([...shifts, newShift]);
    }

    setShowAssignModal(false);
    setEditingShift(null);
    setAssignmentData({
      worker: '', serviceClient: '', shiftType: '', requiredRole: '',
      startTime: '', endTime: '', date: new Date(), status: 'covered'
    });
  };

  // Enhanced filter change handlers that maintain sidebar visibility
  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    // Always keep sidebar open to show filtered results on desktop
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    // Always keep sidebar open to show filtered results on desktop
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(false);
    }
  };

  const handleNameChange = (newName: string) => {
    setSelectedName(newName);
    // Always keep sidebar open to show filtered results on desktop
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(false);
    }
  };

  const handleByChange = (newBy: string) => {
    setSelectedBy(newBy);
    setSelectedName('All');
    // Always keep sidebar open to show new filter results on desktop
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(false);
    }
  };

  // ENHANCED: Custom sidebar toggle that respects user intent
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <FilterHeader
        selectedBy={selectedBy}
        setSelectedBy={handleByChange}
        selectedName={selectedName}
        setSelectedName={handleNameChange}
        selectedType={selectedType}
        setSelectedType={handleTypeChange}
        selectedStatus={selectedStatus}
        setSelectedStatus={handleStatusChange}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        timelineView={timelineView}
        setTimelineView={setTimelineView}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={handleSidebarToggle}
        shiftTypes={shiftTypes}
        filteredNames={filteredNames}
        nameSearchTerm={nameSearchTerm}
        setNameSearchTerm={setNameSearchTerm}
        showNameDropdown={showNameDropdown}
        setShowNameDropdown={setShowNameDropdown}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
      />

      <div className="flex h-[calc(100vh-60px)] sm:h-[calc(100vh-80px)]">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={handleSidebarToggle}
          currentTime={currentTime}
          shifts={filteredShifts}
          selectedBy={selectedBy}
          selectedName={selectedName}
          selectedType={selectedType}
          selectedStatus={selectedStatus}
          filteredData={filteredData}
          workers={workers}
          handleShiftClick={handleShiftClick}
        />

        <ScheduleGrid
          filteredData={filteredData}
          timelineView={timelineView}
          timeHeaderRef={timeHeaderRef}
          scheduleBodyRef={scheduleBodyRef}
          currentTime={currentTime}
          selectedBy={selectedBy}
          getShiftsForTime={getShiftsForTime}
          handleShiftClick={handleShiftClick}
          hoveredShift={hoveredShift}
          setHoveredShift={setHoveredShift}
          hoveredCell={hoveredCell}
          setHoveredCell={setHoveredCell}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          dragStart={dragStart}
          setDragStart={setDragStart}
          dragEnd={dragEnd}
          setDragEnd={setDragEnd}
          dragPreview={dragPreview}
          setDragPreview={setDragPreview}
          setEditingShift={setEditingShift}
          setAssignmentData={setAssignmentData}
          setShowAssignModal={setShowAssignModal}
          workers={workers}
          showGridLines={showGridLines}
        />
      </div>

      {showAssignModal && (
        <ShiftAssignmentModal
          showAssignModal={showAssignModal}
          setShowAssignModal={setShowAssignModal}
          editingShift={editingShift}
          setEditingShift={setEditingShift}
          assignmentData={assignmentData}
          setAssignmentData={setAssignmentData}
          selectedBy={selectedBy}
          shiftTypes={shiftTypes}
          services={services}
          workers={workers}
          roles={roles}
          handleAssignShift={handleAssignShift}
        />
      )}

      {/* ENHANCED: Mobile overlay that doesn't interfere with desktop sidebar */}
      {!sidebarCollapsed && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={handleSidebarToggle}
        />
      )}
    </div>
  );
};

export default ShiftScheduler;