import React, { useEffect, useState } from 'react';
import { getTopUsers } from '../services/leaderboardService';
import './Leaderboard.css';

function Leaderboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getTopUsers();
        setUsers(data);
      } catch {
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="leaderboardContainer">Loading leaderboard...</div>;
  if (error) return <div className="leaderboardContainer errorMessage">{error}</div>;

  return (
    <div className="leaderboardContainer">
      <h2 className="leaderboardTitle">🏆 Leaderboard</h2>
      <div className="divider"></div>
      <table className="leaderboardTable">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id ?? i}>
              <td>{i + 1}</td>
              <td>{u.username}</td>
              <td>{u.points ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
