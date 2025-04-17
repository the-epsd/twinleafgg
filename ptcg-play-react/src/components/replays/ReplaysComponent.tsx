import React, { useState, useEffect } from 'react';
import { socketService } from '../../services/socket.service';
import { ApiError } from '../../services/api.error';

interface Replay {
  id: number;
  gameId: number;
  player1: string;
  player2: string;
  winner: string;
  duration: number;
  timestamp: string;
}

const ReplaysComponent: React.FC = () => {
  const [replays, setReplays] = useState<Replay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReplays = async () => {
      try {
        setLoading(true);
        const replayData = await socketService.emit<void, Replay[]>('replays:get');
        setReplays(replayData);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError('Failed to load replays');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReplays();
  }, []);

  if (loading) {
    return <div>Loading replays...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="replays-container">
      <h1>Game Replays</h1>
      <div className="replays-list">
        {replays.map(replay => (
          <div key={replay.id} className="replay-item">
            <div className="replay-header">
              <span>Game #{replay.gameId}</span>
              <span>{new Date(replay.timestamp).toLocaleString()}</span>
            </div>
            <div className="replay-players">
              <span>{replay.player1} vs {replay.player2}</span>
            </div>
            <div className="replay-details">
              <span>Winner: {replay.winner}</span>
              <span>Duration: {Math.floor(replay.duration / 60)}m {replay.duration % 60}s</span>
            </div>
            <button onClick={() => window.location.href = `/replay/${replay.id}`}>
              Watch Replay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReplaysComponent; 