import React, { useEffect, useState } from 'react';
import { getAllBadges, BadgeDTO } from '../services/allBadgesService';
import './AllBadgesList.css';

function AllBadgesList() {
  const [badges, setBadges] = useState<BadgeDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="allBadgesContainer">
        <h2 className="allBadgesTitle">All achievements</h2>
        <div className="divider"></div>
        <div className="loadingMessage">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="allBadgesContainer">
        <h2 className="allBadgesTitle">All achievements</h2>
        <div className="divider"></div>
        <div className="errorMessage">{error}</div>
      </div>
    );
  }

  return (
    <div className="allBadgesContainer">
      <h2 className="allBadgesTitle">All achievements</h2>
      <div className="divider"></div>
      <div className="badgesScrollList">
        {badges.map((badge) => (
          <div key={badge.badge_id} className="badgeItem">
            <span className="badgeDescription">{badge.badge_description}</span>
            <span className="badgeProgress">
              {badge.progress_value}/{badge.requirement_value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllBadgesList;
