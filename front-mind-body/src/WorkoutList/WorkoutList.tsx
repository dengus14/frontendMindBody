import React, { useState, useEffect, useContext } from 'react';
import './WorkoutList.css'

import { Plus, Edit3, Trash2 } from 'lucide-react';

import { fetchWorkouts as getWorkouts, addWorkout, Workout, WorkoutType,updateWorkout, deleteWorkout} from '../services/workoutService';
import { AuthContext } from '../context/AuthContext';
import AddWorkoutModal from './AddWorkoutModal/AddWorkoutModal';
import EditWorkoutModal from './EditWorkoutModal/EditWorkoutModal';


const WorkoutList = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const authContext = useContext(AuthContext);
  const openModal = () => {
  setExpandedId(null); 
  setIsModalOpen(true);
};
    const closeModal = () => {
    setIsModalOpen(false);
    setExpandedId(null);
    };

    const openEditModal = (workout:Workout) => {
    setSelectedWorkout(workout);
    setExpandedId(null); 
    setIsEditModalOpen(true);
};

    const closeEditModal = () => {
    setIsEditModalOpen(false);
    setExpandedId(null);
    };

const handleEditWorkout = async (data: {
  workoutType: string;
  durationMinutes: number;
  notes: string;
}) => {
  if (!selectedWorkout) return;
  await updateWorkout({
    id: selectedWorkout.id,
    workoutType: data.workoutType as WorkoutType,
    durationMinutes: data.durationMinutes,
    notes: data.notes || '',
  });

  const refreshed = await getWorkouts();
  setWorkouts(refreshed.slice(0, 10));
  closeEditModal();
};
const handleDeleteWorkout = async (id: number) => {
  if (!window.confirm('Are you sure you want to delete this workout?')) return;
  await deleteWorkout(id);
  const refreshed = await getWorkouts();
  setWorkouts(refreshed.slice(0, 10));
};


  useEffect(() => {
    let mounted = true;
    getWorkouts()
      .then(data => mounted && setWorkouts(data.slice(0, 10)))
      .catch(console.error);
    return () => { mounted = false; };
  }, []);

  const toggleExpand = (id: number) => {
    console.log('Clicked ID:', id, 'Current expandedId:', expandedId);
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleSubmitWorkout = async (data: { workoutType: string; durationMinutes: number, notes?: string }) => {
    if (!authContext?.user) {
      throw new Error('User not authenticated');
    }

    const payload = {
      user: {
        username: authContext.user.username || '',
        email: authContext.user.email || '',
        streak_count: 0, 
        longest_streak: 0, 
        last_workout: new Date()
      },
      workoutType: data.workoutType as WorkoutType,
      durationMinutes: data.durationMinutes,
      notes: data.notes || ''
    };

    await addWorkout(payload);
    
    const updatedWorkouts = await getWorkouts();
    setWorkouts(updatedWorkouts.slice(0, 10));
  };

  return (
    <div className="workoutListContainer">
      <div className='buttonContainer'>
        <h2 className="workoutListTitle">Recent Workouts</h2>
       <button className="addWorkoutButton" onClick={openModal} title="Add Workout">
        <Plus size={18} strokeWidth={2.2} />
        </button>
 
      </div>

      <div className="workoutList">
        {workouts.map((workout) => {
          console.log('Rendering workout ID:', workout.id);
          return (
          <div key={workout.id} className="workoutItem">
            <div 
              className="workoutHeader"
              onClick={() => toggleExpand(workout.id)}
            >
              <span className="workoutName">{workout.workoutType}</span>
              <span className={`expandIcon ${expandedId === workout.id ? 'expanded' : ''}`}>
                ▼
              </span>
            </div>
            
            <div className={`workoutDetails ${expandedId === workout.id ? 'expanded' : ''}`}>
              <div className="detailRow">
                <span className="detailLabel">Date:</span>
                <span className="detailValue">{formatDate(workout.created_at)}</span>
              </div>
              <div className="detailRow">
                <span className="detailLabel">Duration:</span>
                <span className="detailValue">{workout.durationMinutes} min</span>
              </div>
              <div className="detailRow">
                <span className="detailLabel">Notes:</span>
                <span className="detailValue">{workout.notes || 'No notes'}</span>
              </div>
              <div className="workoutActions">
              <button 
                className="iconButton editIcon" 
                onClick={() => openEditModal(workout)} 
                title="Edit Workout"
              >
                <Edit3 size={18} strokeWidth={2.2} />
              </button>

              <button 
                className="iconButton deleteIcon" 
                onClick={() => handleDeleteWorkout(workout.id)} 
                title="Delete Workout"
              >
                <Trash2 size={18} strokeWidth={2.2} />
              </button>
              </div>


            </div>
          </div>
        )})}  
      </div>

      <AddWorkoutModal
  isOpen={isModalOpen}
  onClose={closeModal}
  onSubmit={handleSubmitWorkout}
      />

      <EditWorkoutModal
  isOpen={isEditModalOpen}
  onClose={closeEditModal}
  onSubmit={handleEditWorkout}
   workout={selectedWorkout}
      />

    </div>
  );
};

export default WorkoutList;