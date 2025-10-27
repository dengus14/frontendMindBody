import React from 'react';
import WorkoutList from '../WorkoutList/WorkoutList';
import './Dashboard.css';
import AchievementList from '../AchievementList/AchievementList';
import AllBadgesList from '../AllBadgesList/AllBadgesList';
import UserStats from '../UserStats/UserStats';

function Dashboard() {

  return (
    <div className="dashboardContainer">
      <div className="dashboardLayout">
        <WorkoutList />
        <div className="mainCenterDiv">
          <UserStats />
          <AllBadgesList />
        </div>
        <AchievementList />
      </div>
    </div>
  );
}

export default Dashboard;