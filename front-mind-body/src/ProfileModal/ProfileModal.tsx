import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";
import "./ProfileModal.css";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getCurrentUser()
        .then((data) => setUser(data))
        .catch((err) => console.error("Failed to load user:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="modalBackdrop">
        <div className="profileModalContainer">
          <p>Loading user info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modalBackdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="profileModalContainer">
        <div className="profileHeader">
          <h2>Your Profile</h2>
          <button onClick={onClose} className="closeButton">×</button>
        </div>

        {user && (
          <div className="profileBody">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Streak:</strong> {user.streak_count}</p>
            <p><strong>Longest Streak:</strong> {user.longest_streak}</p>
             <p><strong>Total Minutes Worked Out:</strong> {user.totalMinutes}</p>
            <p><strong>Last Workout:</strong> {user.last_workout}</p>
            <p><strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
