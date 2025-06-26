import { Worker, Shift } from '../types/scheduler';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'online': return 'bg-green-400 animate-pulse';
    case 'away': return 'bg-yellow-400';
    case 'offline': return 'bg-gray-400';
    case 'active': return 'bg-green-400 animate-pulse';
    case 'maintenance': return 'bg-orange-400';
    default: return 'bg-gray-400';
  }
};

export const getShiftColor = (status: string): string => {
  if (status === 'covered') {
    return 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 shadow-lg shadow-green-300/50 border-green-400/30';
  } else {
    return 'bg-gradient-to-br from-red-400 via-rose-500 to-pink-600 shadow-lg shadow-red-300/50 border-red-400/30 animate-pulse';
  }
};

export const getTimeSlotBackground = (hour: string): string => {
  const h = parseInt(hour);
  if (h >= 6 && h < 9) return 'bg-gradient-to-b from-orange-50/50 to-yellow-50/50'; // Morning
  if (h >= 9 && h < 12) return 'bg-gradient-to-b from-blue-50/50 to-cyan-50/50'; // Mid-morning
  if (h >= 12 && h < 15) return 'bg-gradient-to-b from-green-50/50 to-emerald-50/50'; // Afternoon
  if (h >= 15 && h < 18) return 'bg-gradient-to-b from-purple-50/50 to-pink-50/50'; // Late afternoon
  if (h >= 18 && h < 21) return 'bg-gradient-to-b from-indigo-50/50 to-blue-50/50'; // Evening
  if (h >= 21 || h < 6) return 'bg-gradient-to-b from-gray-100/50 to-slate-100/50'; // Night
  return '';
};

export const getCellWidth = (timelineView: string): number => {
  if (timelineView === 'compact') return window.innerWidth < 640 ? 40 : window.innerWidth < 1024 ? 56 : 72;
  if (timelineView === 'expanded') return window.innerWidth < 640 ? 56 : window.innerWidth < 1024 ? 72 : 96;
  return window.innerWidth < 640 ? 48 : window.innerWidth < 1024 ? 64 : 80;
};

export const getCurrentTimePosition = (timelineView: string): number => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  return (currentHour + currentMinute / 60) * getCellWidth(timelineView);
};

export const getDaysInMonth = (date: Date): (number | null)[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const days: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  return days;
};

export const getFilteredWorkers = (requiredRole: string, workers: Worker[]): Worker[] => {
  if (!requiredRole) {
    return workers.filter(w => w.role !== 'Service' && w.role !== 'Client');
  }
  return workers.filter(w => w.role === requiredRole);
};

// Enhanced filtering function for shifts
export const getFilteredShifts = (
  shifts: Shift[], 
  selectedType: string, 
  selectedStatus: string
): Shift[] => {
  let filtered = [...shifts];
  
  if (selectedType !== 'All') {
    filtered = filtered.filter(shift => shift.type === selectedType);
  }
  
  if (selectedStatus !== 'All') {
    filtered = filtered.filter(shift => 
      selectedStatus === 'Covered' ? shift.status === 'covered' : shift.status === 'uncovered'
    );
  }
  
  return filtered;
};

// Get shifts by type for statistics
export const getShiftsByType = (shifts: Shift[], type: string): Shift[] => {
  return shifts.filter(shift => shift.type === type);
};

// Get shifts for specific time range
export const getShiftsInTimeRange = (shifts: Shift[], startHour: number, endHour: number): Shift[] => {
  return shifts.filter(shift => {
    const shiftStart = parseInt(shift.startTime.split(':')[0]);
    const shiftEnd = parseInt(shift.endTime.split(':')[0]);
    
    // Handle overnight shifts
    if (shiftEnd < shiftStart) {
      return (shiftStart >= startHour && shiftStart <= 23) || (shiftEnd >= 0 && shiftEnd <= endHour);
    }
    
    return shiftStart >= startHour && shiftStart <= endHour;
  });
};

export const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];