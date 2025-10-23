import React, { useState } from 'react';
import './AddWorkoutModal.css';

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { workoutType: string; durationMinutes: number , notes?: string}) => Promise<void>;
}

const AddWorkoutModal: React.FC<AddWorkoutModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [workoutType, setWorkoutType] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!workoutType) {
      setError('Please select a workout type');
      return;
    }
    
    const duration = parseInt(durationMinutes);
    if (!duration || duration <= 0) {
      setError('Duration must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ workoutType, durationMinutes: duration });
      setWorkoutType('');
      setDurationMinutes('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add workout');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setWorkoutType('');
    setDurationMinutes('');
    setError('');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modalBackdrop" onClick={handleBackdropClick}>
      <div className="modalContainer">
        <div className="modalHeader">
          <h2 className="modalTitle">Add New Workout</h2>
          <button className="closeButton" onClick={handleClose} type="button">
            ×
          </button>
        </div>

        <form className="modalForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="formLabel">Workout Type</label>
            <select
              className="formSelect"
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              disabled={loading}
            >
              <option value="">Select type...</option>
              <option value="PUSH">PUSH</option>
              <option value="PULL">PULL</option>
              <option value="LEGS">LEGS</option>
            </select>
          </div>

          <div className="formGroup">
            <label className="formLabel">Duration (minutes)</label>
            <input
              type="number"
              className="formInput"
              placeholder="Enter duration in minutes"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              min="1"
              disabled={loading}
            />
          </div>

          {error && <p className="errorMessage">{error}</p>}

          <div className="modalButtons">
            <button
              type="button"
              className="cancelButton"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submitButton"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkoutModal;