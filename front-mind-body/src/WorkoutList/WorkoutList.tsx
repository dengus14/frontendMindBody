import React, { useState, useEffect } from 'react';
import './WorkoutList.css'

import { fetchWorkouts as getWorkouts, Workout} from '../services/workoutService';



const WorkoutList = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  useEffect(() => {
    let mounted = true;
    getWorkouts()
      .then(data => mounted && setWorkouts(data.slice(0, 10)))
      .catch(console.error);
    return () => { mounted = false; };
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="workoutListContainer">
      <h2 className="workoutListTitle">Recent Workouts</h2>
      <div className="workoutList">
        {workouts.map((workout) => (
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
            
            {expandedId === workout.id && (
              <div className="workoutDetails">
                <div className="detailRow">
                  <span className="detailLabel">Date:</span>
                  <span className="detailValue">{formatDate(workout.created_at)}</span>
                  
                </div>
                <div className="detailRow">
                  <span className="detailLabel">Notes:</span>
                  <span className="detailValue">{workout.notes}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutList;