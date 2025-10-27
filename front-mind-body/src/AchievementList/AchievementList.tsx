import React, { useEffect, useState } from 'react'
import './AchievementList.css'
import { UserBadgeDTO, getUserBadges } from '../services/userBadgeService'
import { getBadgeImage } from '../assets/badgeImages/badgeIdentifier'
import BadgeDetailPanel from './BadgeDetailPanel/BadgeDetailPanel'

const AchievementList = () => {
  const [badges, setBadges] = useState<UserBadgeDTO[]>([])
  const [selectedBadge, setSelectedBadge] = useState<UserBadgeDTO | null>(null);
  
  useEffect(() => {
    let mounted = true;
    getUserBadges()
      .then(data => mounted && setBadges(data))
      .catch(console.error);
    return () => { mounted = false; };
  }, []);

  const handleBadgeClick = (badge: UserBadgeDTO) => {
    setSelectedBadge(badge);
  };

  const handleClosePanel = () => {
    setSelectedBadge(null);
  };

  return (
    <>
      <div className="achievementListContainer">
        <h2 className="achievementTitle">Achievements</h2>
        <div className="userBadges">
          {badges.length > 0 ? (
            badges.map(badge => {
              const imageUrl = getBadgeImage(badge);

              return (
                <div 
                  key={badge.badge_id}
                  onClick={() => handleBadgeClick(badge)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={imageUrl} alt={badge.badge_name} />
                  <div className="badgeName">{badge.badge_name}</div>
                </div>
              );
            })
          ) : (
            <div className="noBadges">
              You have not earned any badges yet
            </div>
          )}
        </div>
      </div>

      <BadgeDetailPanel
        badge={selectedBadge}
        isOpen={selectedBadge !== null}
        onClose={handleClosePanel}
      />
    </>
  );
}

export default AchievementList