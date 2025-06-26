import React from 'react';
import { Sparkles, Clock, Users, MapPin, Home, Bell, Menu, X, Filter, TrendingUp, AlertTriangle } from 'lucide-react';
import { Worker, Shift } from '../types/scheduler';
import { getStatusColor, getShiftsByType } from '../utils/schedulerUtils';

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  currentTime: Date;
  shifts: Shift[];
  selectedBy: string;
  selectedName: string;
  selectedType: string;
  selectedStatus: string;
  filteredData: Worker[];
  workers: Worker[];
  handleShiftClick: (shift: Shift) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  currentTime,
  shifts,
  selectedBy,
  selectedName,
  selectedType,
  selectedStatus,
  filteredData,
  workers,
  handleShiftClick,
}) => {
  // Calculate filtered statistics
  const uncoveredShifts = shifts.filter(s => s.status === 'uncovered');
  const coveredShifts = shifts.filter(s => s.status === 'covered');
  const nightShifts = getShiftsByType(shifts, 'Night Shift');
  const urgentShifts = uncoveredShifts.filter(s => s.type === 'Night Shift' || s.notes?.includes('urgent') || s.notes?.includes('Urgent'));

  // Get active filters count
  const activeFiltersCount = [
    selectedType !== 'All' ? 1 : 0,
    selectedStatus !== 'All' ? 1 : 0,
    selectedName !== 'All' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className={`
      fixed lg:relative inset-y-0 left-0 z-30 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 shadow-xl
      transform transition-all duration-300 ease-in-out
      ${sidebarCollapsed ? 'w-0 lg:w-16' : 'w-64 sm:w-72 lg:w-80'}
      ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
    `} style={{ 
      // ENHANCED: Ensure sidebar stays fixed and visible during all scroll operations
      position: window.innerWidth >= 1024 ? 'sticky' : 'fixed',
      top: window.innerWidth >= 1024 ? '0' : '0',
      height: '100vh',
      zIndex: 30
    }}>
      <div className="h-full flex flex-col pt-[60px] sm:pt-[80px] lg:pt-0 overflow-hidden">
        <div className={`p-3 sm:p-4 lg:p-6 border-b border-gray-200/50 ${sidebarCollapsed ? 'lg:px-2' : ''}`}>
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                Dashboard
                {activeFiltersCount > 0 && (
                  <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    {activeFiltersCount}
                  </span>
                )}
              </h2>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <Menu className="w-4 h-4 sm:w-5 sm:h-5" /> : <X className="w-4 h-4 sm:w-5 sm:h-5 lg:hidden" />}
            </button>
          </div>
          {!sidebarCollapsed && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-xl border border-teal-200/50">
              <div className="flex items-center gap-2 sm:gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                <div>
                  <div className="text-xs sm:text-sm font-medium text-gray-800">Current Time</div>
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-teal-600">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 flex-1 overflow-y-auto">
            {/* Enhanced Stats Cards with Filtering Results */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200/50">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{uncoveredShifts.length}</div>
                <div className="text-xs sm:text-sm text-red-700">Uncovered</div>
                {selectedStatus === 'Uncovered' && (
                  <div className="text-xs text-red-500 mt-1">Filtered</div>
                )}
              </div>
              <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200/50">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{coveredShifts.length}</div>
                <div className="text-xs sm:text-sm text-green-700">Covered</div>
                {selectedStatus === 'Covered' && (
                  <div className="text-xs text-green-500 mt-1">Filtered</div>
                )}
              </div>
            </div>

            {/* Night Shift Special Alert */}
            {(selectedType === 'Night Shift' || nightShifts.length > 0) && (
              <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🌙</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-indigo-700">Night Shifts</div>
                    <div className="text-xs text-indigo-600">{nightShifts.length} total shifts</div>
                  </div>
                </div>
                {selectedType === 'Night Shift' && (
                  <div className="text-xs text-indigo-500 bg-indigo-100 px-2 py-1 rounded-lg">
                    Showing night shifts only
                  </div>
                )}
              </div>
            )}

            {/* Current Filter Info */}
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-700">Current View</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Filter:</span>
                  <span className="font-medium text-purple-700">{selectedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-purple-700 truncate max-w-[120px]">{selectedName}</span>
                </div>
                {selectedType !== 'All' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-purple-700">{selectedType}</span>
                  </div>
                )}
                {selectedStatus !== 'All' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-purple-700">{selectedStatus}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-purple-200/50">
                  <span className="text-gray-600">Results:</span>
                  <span className="font-bold text-purple-700">{shifts.length} shifts</span>
                </div>
                {selectedName !== 'All' && filteredData.length > 0 && filteredData[0].address && (
                  <div className="flex items-start gap-2 mt-2 pt-2 border-t border-purple-200/50">
                    <Home className="w-3 h-3 text-purple-600 mt-0.5" />
                    <span className="text-xs text-purple-700 break-words">{filteredData[0].address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Active Workers / Services / Clients based on filter - ALWAYS VISIBLE */}
            <div className="mt-4 sm:mt-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                {selectedBy === 'Worker' ? (
                  <>
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    Active Workers
                  </>
                ) : selectedBy === 'Client' ? (
                  <>
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    Clients
                  </>
                ) : (
                  <>
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    Services
                  </>
                )}
              </h3>
              <div className="space-y-1 sm:space-y-2 max-h-96 overflow-y-auto">
                {selectedBy === 'Worker' ? (
                  workers.filter(w => w.role !== 'Service' && w.role !== 'Client').map(worker => (
                    <div key={worker.id} className="p-2 sm:p-3 bg-white/60 rounded-lg border border-gray-200/50 hover:bg-white/80 transition-all hover:shadow-md">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                          {worker.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-medium text-gray-800 truncate">{worker.name}</div>
                          <div className="text-xs text-gray-500">{worker.role}</div>
                          <div className="text-xs text-gray-400 truncate mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {worker.address}
                          </div>
                        </div>
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusColor(worker.status)}`}></div>
                      </div>
                    </div>
                  ))
                ) : selectedBy === 'Client' ? (
                  workers.filter(w => w.role === 'Client').map(client => (
                    <div key={client.id} className="p-2 sm:p-3 bg-white/60 rounded-lg border border-gray-200/50 hover:bg-white/80 transition-all hover:shadow-md">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                          {client.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-medium text-gray-800 truncate">{client.name}</div>
                          <div className="text-xs text-gray-400 truncate mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {client.address}
                          </div>
                        </div>
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusColor(client.status)}`}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  workers.filter(w => w.role === 'Service').map(service => (
                    <div key={service.id} className="p-2 sm:p-3 bg-white/60 rounded-lg border border-gray-200/50 hover:bg-white/80 transition-all hover:shadow-md">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                          {service.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-medium text-gray-800 truncate">{service.name}</div>
                          <div className="text-xs text-gray-400 truncate mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {service.address}
                          </div>
                        </div>
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusColor(service.status)}`}></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Enhanced Uncovered Shifts with Priority - ALWAYS VISIBLE */}
            <div className="mt-4 sm:mt-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4 animate-bounce" />
                Urgent Shifts
                {urgentShifts.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {urgentShifts.length}
                  </span>
                )}
              </h3>
              <div className="space-y-1 sm:space-y-2">
                {uncoveredShifts.map(shift => {
                  const location = workers.find(w => w.name === shift.serviceClient);
                  const isUrgent = shift.type === 'Night Shift' || shift.notes?.includes('urgent') || shift.notes?.includes('Urgent');
                  return (
                    <div key={shift.id} className={`p-2 sm:p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                      isUrgent 
                        ? 'bg-gradient-to-r from-red-100 to-red-150 border-red-300/50 hover:from-red-150 hover:to-red-200' 
                        : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200/50 hover:from-red-100 hover:to-red-150'
                    }`}
                         onClick={() => handleShiftClick(shift)}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-xs sm:text-sm font-medium text-red-800">{shift.type}</div>
                            {isUrgent && <AlertTriangle className="w-3 h-3 text-red-600 animate-pulse" />}
                          </div>
                          <div className="text-xs text-red-600">{shift.serviceClient}</div>
                          <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                            <Clock className="w-3 h-3" />
                            {shift.startTime} - {shift.endTime}
                          </div>
                          {location?.address && (
                            <div className="flex items-center gap-1 text-xs text-red-400 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{location.address}</span>
                            </div>
                          )}
                        </div>
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isUrgent ? 'bg-red-600 animate-pulse' : 'bg-red-500'}`}></div>
                      </div>
                    </div>
                  );
                })}
                {uncoveredShifts.length === 0 && (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    {selectedStatus === 'Covered' ? 'No uncovered shifts in current filter' : 'All shifts are covered! 🎉'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;