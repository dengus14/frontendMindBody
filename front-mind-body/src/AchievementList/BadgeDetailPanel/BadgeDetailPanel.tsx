import React from 'react';
import './BadgeDetailPanel.css';
import { UserBadgeDTO } from '../../services/userBadgeService';
import { getBadgeImage } from '../../assets/badgeImages/badgeIdentifier';

interface BadgeDetailPanelProps {
  badge: UserBadgeDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

const BadgeDetailPanel: React.FC<BadgeDetailPanelProps> = ({ badge, isOpen, onClose }) => {
  if (!badge) return null;

  const imageUrl = getBadgeImage(badge);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRequirementText = (): string => {
    const type = badge.requirement_type;
    const value = badge.requirement_value;

    switch (type) {
      case 'STREAK':
        return `Maintain a ${value} day workout streak`;
      case 'WORKOUT_COUNT':
        return `Complete ${value} workouts`;
      case 'DURATION':
        return `Accumulate ${value} minutes of exercise`;
      default:
        return `Complete requirement: ${value}`;
    }
  };

  return (
    <>
      <div className="badgeDetailsBackdrop" onClick={handleBackdropClick}>
        <div className={`badgeDetailsPanel ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="badgeHeader">
            <h2 className="badgeHeaderTitle">Badge Details</h2>
            <button className="closeButton" onClick={onClose} type="button">
              ×
            </button>
          </div>

          {imageUrl && (
            <div className="badgeImageContainer">
              <img src={imageUrl} alt={badge.badge_name} className="badgeImageLarge" />
            </div>
          )}

          <div className="badgeInfo">
            <div className="infoSection">
              <div className="infoLabel">Badge Name</div>
              <div className="infoValue">{badge.badge_name}</div>
            </div>

            <div className="infoSection">
              <div className="infoLabel">Description</div>
              <div className="badgeDescription">{badge.badge_description}</div>
            </div>

            <div className="infoSection">
              <div className="infoLabel">Earned On</div>
              <div className="earnedDate">{formatDate(badge.earned_at)}</div>
            </div>

            <div className="infoSection">
              <div className="infoLabel">Requirement</div>
              <div className="requirementText">
                {getRequirementText()}
              </div>
              <div className="requirementValue">{badge.requirement_value} {badge.requirement_type === 'STREAK' ? 'days' : badge.requirement_type === 'DURATION' ? 'minutes' : 'workouts'}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BadgeDetailPanel;