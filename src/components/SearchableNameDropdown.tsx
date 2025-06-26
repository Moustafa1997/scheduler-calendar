import React, { useRef, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { Worker } from '../types/scheduler';
import { getStatusColor } from '../utils/schedulerUtils';

interface SearchableNameDropdownProps {
  selectedName: string;
  setSelectedName: (value: string) => void;
  filteredNames: Worker[];
  nameSearchTerm: string;
  setNameSearchTerm: (value: string) => void;
  showNameDropdown: boolean;
  setShowNameDropdown: (value: boolean) => void;
}

const SearchableNameDropdown: React.FC<SearchableNameDropdownProps> = ({
  selectedName,
  setSelectedName,
  filteredNames,
  nameSearchTerm,
  setNameSearchTerm,
  showNameDropdown,
  setShowNameDropdown,
}) => {
  const nameDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (nameDropdownRef.current && !nameDropdownRef.current.contains(event.target as Node)) {
        setShowNameDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowNameDropdown]);

  return (
    <div className="flex items-center gap-1 sm:gap-2 relative" ref={nameDropdownRef}>
      <label className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">Name</label>
      <div className="relative">
        <button
          onClick={() => setShowNameDropdown(!showNameDropdown)}
          className="px-2 py-1 sm:px-3 sm:py-1.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/90 backdrop-blur-sm flex items-center gap-1 sm:gap-2 min-w-[100px] sm:min-w-[150px] lg:min-w-[200px] justify-between hover:shadow-md transition-all"
        >
          <span className="truncate">{selectedName}</span>
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
        </button>
        
        {showNameDropdown && (
          <div className="fixed inset-0 z-[9999]" onClick={() => setShowNameDropdown(false)}>
            <div 
              className="absolute bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl shadow-2xl overflow-hidden min-w-[250px] max-w-[350px]"
              style={{
                top: nameDropdownRef.current?.getBoundingClientRect().bottom + 8,
                left: nameDropdownRef.current?.getBoundingClientRect().left,
                transform: nameDropdownRef.current?.getBoundingClientRect().right > window.innerWidth - 250 ? 'translateX(-100%)' : 'none',
                right: nameDropdownRef.current?.getBoundingClientRect().right > window.innerWidth - 250 ? nameDropdownRef.current?.getBoundingClientRect().right : 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Search..."
                  value={nameSearchTerm}
                  onChange={(e) => setNameSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/90"
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedName('All');
                    setShowNameDropdown(false);
                    setNameSearchTerm('');
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-teal-50 transition-colors border-b border-gray-50"
                >
                  <span className="font-medium">All</span>
                </button>
                {filteredNames.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedName(item.name);
                      setShowNameDropdown(false);
                      setNameSearchTerm('');
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-teal-50 transition-colors border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></div>
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.role}</div>
                        {item.address && (
                          <div className="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {item.address}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableNameDropdown;