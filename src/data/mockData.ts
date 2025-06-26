import { Worker, Shift } from '../types/scheduler';

export const workers: Worker[] = [
  { id: 1, name: 'Abu, Blessing (Blessing)', email: 'blessing@example.com', role: 'Support Worker', avatar: 'AB', status: 'online', address: '123 Main St, London, E1 1AA' },
  { id: 2, name: 'Adeoye, Omolara', email: 'omolara@example.com', role: 'Support Worker', avatar: 'AO', status: 'offline', address: '456 Park Rd, London, E2 2BB' },
  { id: 3, name: 'Agyemang, Belinda (Belinda)', email: 'belinda@example.com', role: 'Team Leader', avatar: 'AB', status: 'online', address: '789 High St, London, E3 3CC' },
  { id: 4, name: 'Ahmed, Jaber (Jaber)', email: 'jaber@example.com', role: 'Manager', avatar: 'AJ', status: 'away', address: '321 Queens Rd, London, E4 4DD' },
  { id: 5, name: 'Johnson, Mike', email: 'mike@example.com', role: 'Support Worker', avatar: 'JM', status: 'online', address: '654 Kings Ave, London, E5 5EE' },
  { id: 6, name: 'Williams, Sarah', email: 'sarah.w@example.com', role: 'Senior Support Worker', avatar: 'WS', status: 'online', address: '987 Victoria St, London, E6 6FF' },
  
  // Services with addresses
  { id: 10, name: '26 Waverley Lodge', email: 'waverley@example.com', role: 'Service', avatar: '26', status: 'active', address: '26 Waverley Rd, Chingford, London, E4 8DH' },
  { id: 11, name: 'Chingford', email: 'chingford@example.com', role: 'Service', avatar: 'CF', status: 'active', address: '15 Station Rd, Chingford, London, E4 7BJ' },
  { id: 12, name: 'Clayburn Lodge', email: 'clayburn@example.com', role: 'Service', avatar: 'CL', status: 'maintenance', address: '42 Clayburn Rd, Walthamstow, London, E17 5BQ' },
  { id: 13, name: 'St. James Walk', email: 'stjames@example.com', role: 'Service', avatar: 'SJ', status: 'active', address: '88 St. James St, Walthamstow, London, E17 7PJ' },
  { id: 14, name: 'Eastern Lodge', email: 'eastern@example.com', role: 'Service', avatar: 'EL', status: 'active', address: '103 Eastern Ave, Ilford, Essex, IG2 6JX' },
  { id: 15, name: 'Grays House', email: 'grays@example.com', role: 'Service', avatar: 'GH', status: 'active', address: '55 Grays Inn Rd, Camden, London, WC1X 8PP' },
  
  // Clients with addresses
  { id: 20, name: 'John Smith', email: 'john.smith@example.com', role: 'Client', avatar: 'JS', status: 'active', address: 'Room 12, 26 Waverley Lodge' },
  { id: 21, name: 'Mary Johnson', email: 'mary.johnson@example.com', role: 'Client', avatar: 'MJ', status: 'active', address: 'Room 8, Clayburn Lodge' },
  { id: 22, name: 'Robert Brown', email: 'robert.brown@example.com', role: 'Client', avatar: 'RB', status: 'active', address: 'Flat 3A, St. James Walk' },
  { id: 23, name: 'Sarah Davis', email: 'sarah.davis@example.com', role: 'Client', avatar: 'SD', status: 'active', address: 'Room 15, Eastern Lodge' },
  { id: 24, name: 'Michael Wilson', email: 'michael.wilson@example.com', role: 'Client', avatar: 'MW', status: 'active', address: 'Flat 2B, Grays House' },
  { id: 25, name: 'Emma Thompson', email: 'emma.thompson@example.com', role: 'Client', avatar: 'ET', status: 'active', address: 'Room 5, 26 Waverley Lodge' },
  { id: 26, name: 'David Miller', email: 'david.miller@example.com', role: 'Client', avatar: 'DM', status: 'active', address: 'Room 10, Chingford' },
  { id: 27, name: 'Lisa Anderson', email: 'lisa.anderson@example.com', role: 'Client', avatar: 'LA', status: 'active', address: 'Flat 1C, St. James Walk' }
];

export const shiftTypes = [
  'Internal', 'Manager', 'Night Shift', 'Office Staff', 'On Call – On Site',
  'On Call Shift', 'Shadowing', 'Support Worker', 'Team Leader', 'Training'
];

export const roles = ['Support Worker', 'Senior Support Worker', 'Team Leader', 'Manager'];

export const services = ['26 Waverley Lodge', 'Chingford', 'Clayburn Lodge', 'St. James Walk', 'Eastern Lodge', 'Grays House'];

export const initialShifts: Shift[] = [
  // Night Shifts - Multiple examples
  { 
    id: 1, workerId: null, workerName: '', serviceClient: '26 Waverley Lodge', 
    type: 'Night Shift', requiredRole: 'Support Worker', startTime: '22:00', endTime: '06:00', 
    date: new Date(), status: 'uncovered', notes: 'Urgent night coverage needed'
  },
  { 
    id: 2, workerId: 1, workerName: 'Abu, Blessing', serviceClient: 'Clayburn Lodge', 
    type: 'Night Shift', requiredRole: 'Support Worker', startTime: '20:00', endTime: '08:00', 
    date: new Date(), status: 'covered', notes: 'Regular night shift'
  },
  { 
    id: 3, workerId: null, workerName: '', serviceClient: 'St. James Walk', 
    type: 'Night Shift', requiredRole: 'Team Leader', startTime: '23:00', endTime: '07:00', 
    date: new Date(), status: 'uncovered', notes: 'Night supervision required'
  },
  { 
    id: 4, workerId: 2, workerName: 'Adeoye, Omolara', serviceClient: 'Eastern Lodge', 
    type: 'Night Shift', requiredRole: 'Support Worker', startTime: '21:00', endTime: '05:00', 
    date: new Date(), status: 'covered', notes: 'Night care shift'
  },
  
  // Support Worker Shifts
  { 
    id: 5, workerId: 3, workerName: 'Agyemang, Belinda', serviceClient: 'John Smith', 
    type: 'Support Worker', requiredRole: 'Support Worker', startTime: '09:00', endTime: '15:00', 
    date: new Date(), status: 'covered', notes: 'Personal care support'
  },
  { 
    id: 6, workerId: null, workerName: '', serviceClient: 'Mary Johnson', 
    type: 'Support Worker', requiredRole: 'Support Worker', startTime: '08:00', endTime: '16:00', 
    date: new Date(), status: 'uncovered', notes: 'Daily living support needed'
  },
  { 
    id: 7, workerId: 5, workerName: 'Johnson, Mike', serviceClient: 'Robert Brown', 
    type: 'Support Worker', requiredRole: 'Support Worker', startTime: '14:00', endTime: '22:00', 
    date: new Date(), status: 'covered', notes: 'Evening support'
  },
  { 
    id: 8, workerId: 6, workerName: 'Williams, Sarah', serviceClient: 'Sarah Davis', 
    type: 'Support Worker', requiredRole: 'Senior Support Worker', startTime: '10:00', endTime: '18:00', 
    date: new Date(), status: 'covered', notes: 'Specialized care'
  },
  
  // Team Leader Shifts
  { 
    id: 9, workerId: 3, workerName: 'Agyemang, Belinda', serviceClient: 'Grays House', 
    type: 'Team Leader', requiredRole: 'Team Leader', startTime: '07:00', endTime: '19:00', 
    date: new Date(), status: 'covered', notes: 'Team supervision'
  },
  { 
    id: 10, workerId: null, workerName: '', serviceClient: 'Chingford', 
    type: 'Team Leader', requiredRole: 'Team Leader', startTime: '12:00', endTime: '20:00', 
    date: new Date(), status: 'uncovered', notes: 'Leadership coverage needed'
  },
  
  // Manager Shifts
  { 
    id: 11, workerId: 4, workerName: 'Ahmed, Jaber', serviceClient: '26 Waverley Lodge', 
    type: 'Manager', requiredRole: 'Manager', startTime: '09:00', endTime: '17:00', 
    date: new Date(), status: 'covered', notes: 'Management oversight'
  },
  
  // Training Shifts
  { 
    id: 12, workerId: null, workerName: '', serviceClient: 'Emma Thompson', 
    type: 'Training', requiredRole: 'Support Worker', startTime: '10:00', endTime: '14:00', 
    date: new Date(), status: 'uncovered', notes: 'New staff training required'
  },
  { 
    id: 13, workerId: 1, workerName: 'Abu, Blessing', serviceClient: 'David Miller', 
    type: 'Training', requiredRole: 'Support Worker', startTime: '13:00', endTime: '17:00', 
    date: new Date(), status: 'covered', notes: 'Skills development'
  },
  
  // On Call Shifts
  { 
    id: 14, workerId: 5, workerName: 'Johnson, Mike', serviceClient: 'Lisa Anderson', 
    type: 'On Call Shift', requiredRole: 'Support Worker', startTime: '18:00', endTime: '06:00', 
    date: new Date(), status: 'covered', notes: 'Emergency on-call'
  },
  { 
    id: 15, workerId: null, workerName: '', serviceClient: 'Michael Wilson', 
    type: 'On Call – On Site', requiredRole: 'Senior Support Worker', startTime: '16:00', endTime: '08:00', 
    date: new Date(), status: 'uncovered', notes: 'On-site emergency coverage'
  }
];