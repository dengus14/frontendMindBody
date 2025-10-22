import React, { useState, useEffect, useContext } from 'react';
import './WorkoutList.css'

import { fetchWorkouts as getWorkouts, addWorkout, Workout, WorkoutType} from '../services/workoutService';
import { AuthContext } from '../context/AuthContext';
import AddWorkoutModal from './AddWorkoutModal/AddWorkoutModal';


const WorkoutList = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const authContext = useContext(AuthContext);
  const openModal = () => {
  setExpandedId(null); 
  setIsModalOpen(true);
};
    const closeModal = () => {
    setIsModalOpen(false);
    setExpandedId(null);
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

  const handleSubmitWorkout = async (data: { workoutType: string; durationMinutes: number }) => {
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
      durationMinutes: data.durationMinutes
    };

    await addWorkout(payload);
    
    const updatedWorkouts = await getWorkouts();
    setWorkouts(updatedWorkouts.slice(0, 10));
  };

  return (
    <div className="workoutListContainer">
      <div className='buttonContainer'>
        <h2 className="workoutListTitle">Recent Workouts</h2>
        <button className="addWorkoutButton" onClick={openModal}>Add Workout</button>
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
            </div>
          </div>
        )})}
      </div>

      <AddWorkoutModal
  isOpen={isModalOpen}
  onClose={closeModal}
  onSubmit={handleSubmitWorkout}
/>
    </div>
  );
};

export default WorkoutList;