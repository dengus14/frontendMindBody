import React, { useEffect, useState, useMemo } from 'react';
import { getActiveChallenges, claimChallenge, ChallengeDTO } from '../services/challengeService';
import { Trophy, Award } from 'lucide-react';
import './ChallengeList.css';

type ChallengeTab = 'DAILY' | 'WEEKLY';

function ChallengeList() {
  const [challenges, setChallenges] = useState<ChallengeDTO[]>([]);
  const [activeTab, setActiveTab] = useState<ChallengeTab>('DAILY');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<number | null>(null);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveChallenges();
      
      // Deduplicate challenges based on userChallengeId
      const uniqueChallenges = Array.from(
        new Map(data.map(item => [item.userChallengeId, item])).values()
      );
      
      setChallenges(uniqueChallenges);
    } catch (err) {
      setError('Failed to load challenges');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add small delay to allow backend to assign challenges on first load
    const timer = setTimeout(() => {
      fetchChallenges();
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-retry if no challenges are returned (for new users)
  useEffect(() => {
    if (!loading && challenges.length === 0 && !error) {
      const retryTimer = setTimeout(() => {
        console.log('No challenges found, retrying...');
        fetchChallenges();
      }, 1000);
      
      return () => clearTimeout(retryTimer);
    }
  }, [loading, challenges.length, error]);

  const handleClaim = async (userChallengeId: number) => {
    try {
      setClaimingId(userChallengeId);
      const response = await claimChallenge(userChallengeId);
      
      if (response.success) {
        // Refresh challenges to show updated claimed status
        await fetchChallenges();
        
        // Optional: Show success message or animation
        console.log(`Claimed ${response.pointsAwarded} points! New total: ${response.newTotalPoints}`);
      }
    } catch (err) {
      console.error('Failed to claim challenge:', err);
      setError('Failed to claim challenge');
    } finally {
      setClaimingId(null);
    }
  };

  // Use useMemo to ensure filtered challenges update when tab changes
  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => c.challengeType === activeTab);
  }, [challenges, activeTab]);

  if (loading) {
    return (
      <div className="challengeListContainer">
        <div className="challengeHeader">
          <Award className="challengeIcon" size={24} />
          <h2 className="challengeTitle">Challenges</h2>
        </div>
        <div className="loadingMessage">Loading challenges...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="challengeListContainer">
        <div className="challengeHeader">
          <Award className="challengeIcon" size={24} />
          <h2 className="challengeTitle">Challenges</h2>
        </div>
        <div className="errorMessage">
          {error}
          <button 
            onClick={fetchChallenges} 
            style={{ 
              marginTop: '10px', 
              padding: '8px 16px', 
              cursor: 'pointer',
              borderRadius: '6px',
              border: 'none',
              background: '#1A5CFF',
              color: 'white'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="challengeListContainer">
      <div className="challengeHeader">
        <Award className="challengeIcon" size={24} />
        <h2 className="challengeTitle">Challenges</h2>
      </div>

      <div className="challengeTabs">
        <button
          className={`tabButton ${activeTab === 'DAILY' ? 'active' : ''}`}
          onClick={() => setActiveTab('DAILY')}
        >
          Daily
        </button>
        <button
          className={`tabButton ${activeTab === 'WEEKLY' ? 'active' : ''}`}
          onClick={() => setActiveTab('WEEKLY')}
        >
          Weekly
        </button>
      </div>

      <div className="challengesDivider" />

      <div className="challengesScrollList">
        {filteredChallenges.length === 0 ? (
          <div className="noChallenges">
            No {activeTab.toLowerCase()} challenges available
          </div>
        ) : (
          filteredChallenges.map((challenge) => (
            <div key={challenge.userChallengeId} className="challengeItem">
              <div className="challengeInfo">
                <div className="challengeName">{challenge.challengeName}</div>
                <div className="challengeDescription">{challenge.challengeDescription}</div>
              </div>
              <div className="challengeAction">
                {challenge.completed && !challenge.claimed ? (
                  <button
                    className="claimButton"
                    onClick={() => handleClaim(challenge.userChallengeId)}
                    disabled={claimingId === challenge.userChallengeId}
                  >
                    <Trophy size={16} />
                    {claimingId === challenge.userChallengeId ? 'Claiming...' : `Claim ${challenge.points}pts`}
                  </button>
                ) : challenge.claimed ? (
                  <div className="claimedBadge">
                    <Trophy size={14} />
                    Claimed
                  </div>
                ) : (
                  <div className="challengeProgress">
                    {challenge.currentProgress}/{challenge.requirementValue}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChallengeList;
