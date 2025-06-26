import React, { useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getDaysInMonth, monthNames } from '../utils/schedulerUtils';

interface DatePickerProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  setSelectedDate,
  showDatePicker,
  setShowDatePicker,
}) => {
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDatePicker]);

  return (
    <div className="ml-auto relative" ref={datePickerRef}>
      <button
        onClick={() => setShowDatePicker(!showDatePicker)}
        className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 border border-gray-200 rounded-lg hover:bg-white/90 hover:shadow-md transition-all bg-white/80 backdrop-blur-sm text-xs sm:text-sm"
      >
        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
        <span className="font-medium hidden sm:inline">{selectedDate.toLocaleDateString()}</span>
        <span className="font-medium sm:hidden">{selectedDate.getDate()}</span>
      </button>

      {showDatePicker && (
        <div className="fixed inset-0 z-[9998]" onClick={() => setShowDatePicker(false)}>
          <div 
            className="absolute bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl shadow-2xl p-4 sm:p-6 min-w-[280px] sm:min-w-[300px]"
            style={{
              top: datePickerRef.current?.getBoundingClientRect().bottom + 8,
              right: window.innerWidth - datePickerRef.current?.getBoundingClientRect().right,
              maxHeight: 'calc(100vh - 100px)',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="font-semibold text-sm sm:text-lg">
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </span>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-xs sm:text-sm text-center mb-3 sm:mb-4">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="font-semibold text-gray-600 py-1 sm:py-2">{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {getDaysInMonth(selectedDate).map((day, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (day) {
                      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
                      setShowDatePicker(false);
                    }
                  }}
                  disabled={!day}
                  className={`
                    p-2 sm:p-3 text-xs sm:text-sm rounded-lg transition-all
                    ${!day ? 'invisible' : ''}
                    ${day === selectedDate.getDate() 
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg transform scale-105' 
                      : 'hover:bg-teal-50 hover:text-teal-700'
                    }
                  `}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;