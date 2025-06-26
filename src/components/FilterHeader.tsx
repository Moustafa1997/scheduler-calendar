import React from 'react';
import { ChevronDown, Calendar, Eye, Activity, Zap, Sparkles, Menu } from 'lucide-react';
import { Worker } from '../types/scheduler';
import { getStatusColor } from '../utils/schedulerUtils';
import SearchableNameDropdown from './SearchableNameDropdown';
import DatePicker from './DatePicker';

interface FilterHeaderProps {
  selectedBy: string;
  setSelectedBy: (value: string) => void;
  selectedName: string;
  setSelectedName: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedDate: Date;
  setSelectedDate: (value: Date) => void;
  timelineView: string;
  setTimelineView: (value: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  shiftTypes: string[];
  filteredNames: Worker[];
  nameSearchTerm: string;
  setNameSearchTerm: (value: string) => void;
  showNameDropdown: boolean;
  setShowNameDropdown: (value: boolean) => void;
  showDatePicker: boolean;
  setShowDatePicker: (value: boolean) => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({
  selectedBy,
  setSelectedBy,
  selectedName,
  setSelectedName,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  selectedDate,
  setSelectedDate,
  timelineView,
  setTimelineView,
  sidebarCollapsed,
  setSidebarCollapsed,
  shiftTypes,
  filteredNames,
  nameSearchTerm,
  setNameSearchTerm,
  showNameDropdown,
  setShowNameDropdown,
  showDatePicker,
  setShowDatePicker,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-2 sm:px-4 lg:px-6 py-3 shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-wrap text-xs sm:text-sm">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          <label className="text-xs sm:text-sm text-gray-600 font-medium">By</label>
          <select
            value={selectedBy}
            onChange={(e) => {
              setSelectedBy(e.target.value);
              setSelectedName('All');
            }}
            className="px-2 py-1 sm:px-3 sm:py-1.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 bg-white/90 backdrop-blur-sm transition-all"
          >
            <option>Service & Client</option>
            <option>Client</option>
            <option>Worker</option>
          </select>
        </div>

        <SearchableNameDropdown
          selectedName={selectedName}
          setSelectedName={setSelectedName}
          filteredNames={filteredNames}
          nameSearchTerm={nameSearchTerm}
          setNameSearchTerm={setNameSearchTerm}
          showNameDropdown={showNameDropdown}
          setShowNameDropdown={setShowNameDropdown}
        />

        <div className="flex items-center gap-1 sm:gap-2">
          <label className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-1.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 bg-white/90 backdrop-blur-sm transition-all"
          >
            <option>All</option>
            {shiftTypes.map(type => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <label className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-1.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 bg-white/90 backdrop-blur-sm transition-all"
          >
            <option>All</option>
            <option>Covered</option>
            <option>Uncovered</option>
          </select>
        </div>

        <div className="flex items-center gap-1 border-l pl-2 ml-2">
          <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setTimelineView('compact')}
              className={`px-2 py-1 text-xs rounded transition-all ${timelineView === 'compact' ? 'bg-white shadow-sm' : ''}`}
            >
              <Activity className="w-3 h-3" />
            </button>
            <button
              onClick={() => setTimelineView('standard')}
              className={`px-2 py-1 text-xs rounded transition-all ${timelineView === 'standard' ? 'bg-white shadow-sm' : ''}`}
            >
              <Zap className="w-3 h-3" />
            </button>
            <button
              onClick={() => setTimelineView('expanded')}
              className={`px-2 py-1 text-xs rounded transition-all ${timelineView === 'expanded' ? 'bg-white shadow-sm' : ''}`}
            >
              <Sparkles className="w-3 h-3" />
            </button>
          </div>
        </div>

        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
        />
      </div>
    </div>
  );
};

export default FilterHeader;