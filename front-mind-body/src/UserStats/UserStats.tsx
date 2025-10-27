import React, { useEffect, useState, useContext } from 'react';
import { fetchWorkouts, Workout, WorkoutType } from '../services/workoutService';
import { AuthContext } from '../context/AuthContext';
import './UserStats.css';

interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  currentStreak: number;
  longestStreak: number;
  pushCount: number;
  pullCount: number;
  legsCount: number;
  averageDuration: number;
}

function UserStats() {
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const calculateStats = async () => {
      try {
        setLoading(true);
        const workouts = await fetchWorkouts();

        if (workouts.length === 0) {
          setStats({
            totalWorkouts: 0,
            totalDuration: 0,
            currentStreak: 0,
            longestStreak: 0,
            pushCount: 0,
            pullCount: 0,
            legsCount: 0,
            averageDuration: 0,
          });
          return;
        }

        // Sort workouts by date (newest first)
        const sortedWorkouts = [...workouts].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Calculate totals
        const totalWorkouts = workouts.length;
        const totalDuration = workouts.reduce((sum, w) => sum + w.durationMinutes, 0);
        const averageDuration = Math.round(totalDuration / totalWorkouts);

        // Count by type
        const pushCount = workouts.filter((w) => w.workoutType === 'PUSH').length;
        const pullCount = workouts.filter((w) => w.workoutType === 'PULL').length;
        const legsCount = workouts.filter((w) => w.workoutType === 'LEGS').length;

        // Calculate current streak
        const currentStreak = calculateCurrentStreak(sortedWorkouts);
        const longestStreak = calculateLongestStreak(sortedWorkouts);

        setStats({
          totalWorkouts,
          totalDuration,
          currentStreak,
          longestStreak,
          pushCount,
          pullCount,
          legsCount,
          averageDuration,
        });
      } catch (err) {
        console.error('Error calculating stats:', err);
      } finally {
        setLoading(false);
      }
    };

    calculateStats();
  }, []);

  const calculateCurrentStreak = (workouts: Workout[]): number => {
    if (workouts.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < workouts.length; i++) {
      const workoutDate = new Date(workouts[i].created_at);
      workoutDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - streak);

      const diffDays = Math.floor(
        (expectedDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) {
        streak++;
      } else if (diffDays > 1) {
        break;
      }
    }

    return streak;
  };

  const calculateLongestStreak = (workouts: Workout[]): number => {
    if (workouts.length === 0) return 0;

    const sortedAsc = [...workouts].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedAsc.length; i++) {
      const prevDate = new Date(sortedAsc[i - 1].created_at);
      const currDate = new Date(sortedAsc[i].created_at);

      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }

    return longestStreak;
  };

  const getFavoriteWorkoutType = (): string => {
    if (!stats) return 'N/A';
    const max = Math.max(stats.pushCount, stats.pullCount, stats.legsCount);
    if (max === 0) return 'N/A';
    if (stats.pushCount === max) return 'PUSH';
    if (stats.pullCount === max) return 'PULL';
    return 'LEGS';
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="userStatsContainer">
        <h2 className="userStatsTitle">Your Statistics</h2>
        <div className="divider"></div>
        <div className="loadingMessage">Loading stats...</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="userStatsContainer">
      <h2 className="userStatsTitle">Your Statistics</h2>
      <div className="divider"></div>

      <div className="statsGrid">
        <div className="statCard">
          <div className="statIcon">💪</div>
          <div className="statContent">
            <div className="statValue">{stats.totalWorkouts}</div>
            <div className="statLabel">Total Workouts</div>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">🔥</div>
          <div className="statContent">
            <div className="statValue">{stats.currentStreak}</div>
            <div className="statLabel">Current Streak</div>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">🏆</div>
          <div className="statContent">
            <div className="statValue">{stats.longestStreak}</div>
            <div className="statLabel">Longest Streak</div>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">⏱️</div>
          <div className="statContent">
            <div className="statValue">{formatDuration(stats.totalDuration)}</div>
            <div className="statLabel">Total Duration</div>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">📊</div>
          <div className="statContent">
            <div className="statValue">{stats.averageDuration} min</div>
            <div className="statLabel">Avg Duration</div>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">⭐</div>
          <div className="statContent">
            <div className="statValue">{getFavoriteWorkoutType()}</div>
            <div className="statLabel">Favorite Type</div>
          </div>
        </div>
      </div>

      <div className="workoutBreakdown">
        <h3 className="breakdownTitle">Workout Breakdown</h3>
        <div className="breakdownBar">
          <div
            className="breakdownSegment push"
            style={{
              width: stats.totalWorkouts > 0 
                ? `${(stats.pushCount / stats.totalWorkouts) * 100}%` 
                : '0%'
            }}
          >
            {stats.pushCount > 0 && <span className="segmentLabel">{stats.pushCount}</span>}
          </div>
          <div
            className="breakdownSegment pull"
            style={{
              width: stats.totalWorkouts > 0 
                ? `${(stats.pullCount / stats.totalWorkouts) * 100}%` 
                : '0%'
            }}
          >
            {stats.pullCount > 0 && <span className="segmentLabel">{stats.pullCount}</span>}
          </div>
          <div
            className="breakdownSegment legs"
            style={{
              width: stats.totalWorkouts > 0 
                ? `${(stats.legsCount / stats.totalWorkouts) * 100}%` 
                : '0%'
            }}
          >
            {stats.legsCount > 0 && <span className="segmentLabel">{stats.legsCount}</span>}
          </div>
        </div>
        <div className="breakdownLegend">
          <div className="legendItem">
            <span className="legendColor push"></span>
            <span className="legendLabel">PUSH ({stats.pushCount})</span>
          </div>
          <div className="legendItem">
            <span className="legendColor pull"></span>
            <span className="legendLabel">PULL ({stats.pullCount})</span>
          </div>
          <div className="legendItem">
            <span className="legendColor legs"></span>
            <span className="legendLabel">LEGS ({stats.legsCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserStats;
