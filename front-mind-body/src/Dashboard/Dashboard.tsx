import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import WorkoutList from '../WorkoutList/WorkoutList';
import './Dashboard.css';

function Dashboard() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (authContext) {
      await authContext.logout();
      navigate('/login');
    }
  };

  return (
    <div className="dashboardContainer">
      <div className="dashboardLayout">
        <WorkoutList />
        <div className="dashboardContent">
          {/* Main content area */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;