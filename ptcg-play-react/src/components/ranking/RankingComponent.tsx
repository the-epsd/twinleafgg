import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socketService } from '../../services/socket.service';
import { ApiError } from '../../services/api.error';

interface RankingEntry {
  userId: number;
  username: string;
  ranking: number;
  gamesPlayed: number;
  gamesWon: number;
  avatar: string;
}

const RankingComponent: React.FC = () => {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const rankingData = await socketService.emit<void, RankingEntry[]>('ranking:get');
        setRankings(rankingData);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError('Failed to load rankings');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return <div>Loading rankings...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="ranking-container">
      <h1>Player Rankings</h1>

      <div className="ranking-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Rating</th>
              <th>Games Played</th>
              <th>Win Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((player, index) => {
              const winRate = player.gamesPlayed > 0
                ? ((player.gamesWon / player.gamesPlayed) * 100).toFixed(1)
                : '0.0';

              return (
                <tr key={player.userId}>
                  <td>{index + 1}</td>
                  <td className="player-info">
                    <img
                      src={player.avatar || '/default-avatar.png'}
                      alt={`${player.username}'s avatar`}
                      className="player-avatar"
                    />
                    <span>{player.username}</span>
                  </td>
                  <td>{player.ranking}</td>
                  <td>{player.gamesPlayed}</td>
                  <td>{winRate}%</td>
                  <td>
                    <button onClick={() => navigate(`/profile/${player.userId}`)}>
                      View Profile
                    </button>
                    <button onClick={() => navigate(`/message/${player.userId}`)}>
                      Send Message
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingComponent; 