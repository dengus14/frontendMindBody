import React, { useEffect, useState } from 'react';
import './EditWorkoutModal.css'; // reuse same styles

interface EditWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { workoutType: string; durationMinutes: number; notes: string }) => Promise<void>;
  workout: {
    id: number;
    workoutType: string;
    durationMinutes: number;
    notes?: string;
  } | null;
}

const EditWorkoutModal: React.FC<EditWorkoutModalProps> = ({ isOpen, onClose, onSubmit, workout }) => {
  const [workoutType, setWorkoutType] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (workout) {
      setWorkoutType(workout.workoutType);
      setDurationMinutes(String(workout.durationMinutes));
      setNotes(workout.notes || '');
    }
  }, [workout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!workoutType) return setError('Please select a workout type');
    if (!durationMinutes || parseInt(durationMinutes) <= 0)
      return setError('Duration must be greater than 0');

    setLoading(true);
    try {
      await onSubmit({
        workoutType,
        durationMinutes: parseInt(durationMinutes),
        notes,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update workout');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !workout) return null;

  return (
    <div className="modalBackdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modalContainer">
        <div className="modalHeader">
          <h2 className="modalTitle">Edit Workout</h2>
          <button className="closeButton" onClick={onClose}>×</button>
        </div>
        <form className="modalForm" onSubmit={handleSubmit}>
          <label className="formLabel">Workout Type</label>
          <select
            className="formSelect"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            disabled={loading}
          >
            <option value="PUSH">PUSH</option>
            <option value="PULL">PULL</option>
            <option value="LEGS">LEGS</option>
          </select>

          <label className="formLabel">Duration (minutes)</label>
          <input
            type="number"
            className="formInput"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            disabled={loading}
          />

          <label className="formLabel">Notes</label>
          <textarea
            className="formInput"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
          />

          {error && <p className="errorMessage">{error}</p>}

          <div className="modalButtons">
            <button type="button" className="cancelButton" onClick={onClose}>Cancel</button>
            <button type="submit" className="submitButton" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorkoutModal;
