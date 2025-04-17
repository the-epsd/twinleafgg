import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socketService } from '../../services/socket.service';
import { ApiError } from '../../services/api.error';

interface GameState {
  id: number;
  turn: number;
  player1: string;
  player2: string;
  // Add more game state properties as needed
}

const TableComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        setLoading(true);
        const gameData = await socketService.emit<{ gameId: number }, GameState>(
          'game:get',
          { gameId: parseInt(id!) }
        );
        setGameState(gameData);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError('Failed to load game state');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGameState();
    }
  }, [id]);

  if (loading) {
    return <div>Loading game...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!gameState) {
    return <div>Game not found</div>;
  }

  return (
    <div className="table-container">
      <div className="game-header">
        <h2>Game #{gameState.id}</h2>
        <div className="players">
          <div className="player">
            <span>{gameState.player1}</span>
          </div>
          <div className="player">
            <span>{gameState.player2}</span>
          </div>
        </div>
        <div className="turn-indicator">
          Turn: {gameState.turn}
        </div>
      </div>
      {/* Add game board and other UI elements here */}
    </div>
  );
};

export default TableComponent; 