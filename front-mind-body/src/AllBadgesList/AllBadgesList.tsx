import React, { useEffect, useState } from 'react';
import { getAllBadges, BadgeDTO } from '../services/allBadgesService';
import Leaderboard from '../Leaderboard/Leaderboard';
import './AllBadgesList.css';

function AllBadgesList() {
  const [badges, setBadges] = useState<BadgeDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'badges' | 'leaderboard'>('badges');

  useEffect(() => {
    if (view === 'badges') {
      const fetchBadges = async () => {
        try {
          setLoading(true);
          const data = await getAllBadges();
          setBadges(data);
          setError(null);
        } catch (err) {
          setError('Failed to load badges');
          console.error('Error fetching badges:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchBadges();
    }
  }, [view]);

  return (
    <div className="allBadgesContainer">
      <h2 className="allBadgesTitle">
        
        <div className="titleButtons">
          <button
            className={`tabButton ${view === 'badges' ? 'active' : ''}`}
            onClick={() => setView('badges')}
          >
            All Achievements
          </button>
          <button
            className={`tabButton ${view === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setView('leaderboard')}
          >
            Leaderboard
          </button>
        </div>
      </h2>

      <div className="divider"></div>

      {view === 'leaderboard' ? (
        <Leaderboard />
      ) : loading ? (
        <div className="loadingMessage">Loading...</div>
      ) : error ? (
        <div className="errorMessage">{error}</div>
      ) : (
        <div className="badgesScrollList">
          {badges.map((badge) => (
            <div key={badge.badge_id} className="badgeItem">
              <span className="badgeDescription">{badge.badge_description}</span>
              <span
                className={`badgeProgress ${badge.completed ? 'completed' : ''}`}
              >
                {badge.completed
                  ? 'COMPLETED'
                  : `${badge.progress_value}/${badge.requirement_value}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllBadgesList;
