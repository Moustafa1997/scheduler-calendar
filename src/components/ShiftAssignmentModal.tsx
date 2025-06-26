import React from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { Worker, Shift, AssignmentData } from '../types/scheduler';
import { getFilteredWorkers } from '../utils/schedulerUtils';

interface ShiftAssignmentModalProps {
  showAssignModal: boolean;
  setShowAssignModal: (show: boolean) => void;
  editingShift: Shift | null;
  setEditingShift: (shift: Shift | null) => void;
  assignmentData: AssignmentData;
  setAssignmentData: (data: AssignmentData) => void;
  selectedBy: string;
  shiftTypes: string[];
  services: string[];
  workers: Worker[];
  roles: string[];
  handleAssignShift: () => void;
}

const ShiftAssignmentModal: React.FC<ShiftAssignmentModalProps> = ({
  showAssignModal,
  setShowAssignModal,
  editingShift,
  setEditingShift,
  assignmentData,
  setAssignmentData,
  selectedBy,
  shiftTypes,
  services,
  workers,
  roles,
  handleAssignShift,
}) => {
  const filteredWorkers = getFilteredWorkers(assignmentData.requiredRole, workers);

  const handleClose = () => {
    setShowAssignModal(false);
    setEditingShift(null);
    setAssignmentData({
      worker: '', serviceClient: '', shiftType: '', requiredRole: '',
      startTime: '', endTime: '', date: new Date(), status: 'covered'
    });
  };

  if (!showAssignModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-gray-200/50 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            {editingShift ? 'Edit Shift' : 'Create Shift'}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {(selectedBy === 'Worker' || editingShift) && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Worker</label>
              {selectedBy === 'Worker' && !editingShift ? (
                <input
                  type="text"
                  value={assignmentData.worker}
                  readOnly
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-gray-50/50 font-medium text-sm"
                />
              ) : (
                <select
                  value={assignmentData.worker}
                  onChange={(e) => setAssignmentData({...assignmentData, worker: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/90 text-sm"
                >
                  <option value="">Select Worker</option>
                  {filteredWorkers.map(worker => (
                    <option key={worker.id} value={worker.name}>{worker.name}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {selectedBy === 'Client' ? 'Client' : 'Service/Client'}
            </label>
            {(selectedBy === 'Service & Client' || selectedBy === 'Client') && !editingShift ? (
              <input
                type="text"
                value={assignmentData.serviceClient}
                readOnly
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-gray-50/50 font-medium text-sm"
              />
            ) : (
              <select
                value={assignmentData.serviceClient}
                onChange={(e) => setAssignmentData({...assignmentData, serviceClient: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/90 text-sm"
              >
                <option value="">Select Service/Client</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
                {workers.filter(w => w.role === 'Client').map(client => (
                  <option key={client.id} value={client.name}>{client.name}</option>
                ))}
              </select>
            )}
          </div>

          {(selectedBy === 'Client' || (editingShift && assignmentData.requiredRole)) && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Required Role</label>
              <select
                value={assignmentData.requiredRole}
                onChange={(e) => setAssignmentData({...assignmentData, requiredRole: e.target.value, worker: ''})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/90 text-sm"
              >
                <option value="">Select Required Role</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          )}

          {(selectedBy === 'Service & Client' || selectedBy === 'Client') && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Worker</label>
              <select
                value={assignmentData.worker}
                onChange={(e) => setAssignmentData({...assignmentData, worker: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/90 text-sm"
              >
                <option value="">Select Worker</option>
                {filteredWorkers.map(worker => (
                  <option key={worker.id} value={worker.name}>{worker.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="text"
              value={assignmentData.date.toLocaleDateString()}
              readOnly
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-gray-50/50 font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Shift Type</label>
            <select
              value={assignmentData.shiftType}
              onChange={(e) => setAssignmentData({...assignmentData, shiftType: e.target.value})}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/90 text-sm"
            >
              <option value="">Select Shift Type</option>
              {shiftTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={assignmentData.startTime}
                onChange={(e) => setAssignmentData({...assignmentData, startTime: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/90 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={assignmentData.endTime}
                onChange={(e) => setAssignmentData({...assignmentData, endTime: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/90 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
            <div className="flex gap-4 sm:gap-6">
              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="covered"
                  checked={assignmentData.status === 'covered'}
                  onChange={(e) => setAssignmentData({...assignmentData, status: e.target.value as 'covered' | 'uncovered'})}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-green-700">Covered</span>
              </label>
              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="uncovered"
                  checked={assignmentData.status === 'uncovered'}
                  onChange={(e) => setAssignmentData({...assignmentData, status: e.target.value as 'covered' | 'uncovered'})}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-red-700">Uncovered</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            onClick={handleAssignShift}
            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
          >
            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
            {editingShift ? 'Update Shift' : 'Create Shift'}
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftAssignmentModal;