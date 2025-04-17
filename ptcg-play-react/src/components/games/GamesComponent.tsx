import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socketService } from '../../services/socket.service';
import { ApiError } from '../../services/api.error';

interface GameInfo {
  id: number;
  turn: number;
  player1: string;
  player2: string;
}

interface ClientInfo {
  clientId: number;
  userId: number;
  username: string;
  ranking: number;
}

const GamesComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<GameInfo[]>([]);
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to game updates
    const gameSubscription = socketService.on<GameInfo[]>('games:update', (updatedGames) => {
      setGames(updatedGames);
    });

    // Subscribe to client updates
    const clientSubscription = socketService.on<ClientInfo[]>('clients:update', (updatedClients) => {
      setClients(updatedClients);
    });

    return () => {
      socketService.off('games:update');
      socketService.off('clients:update');
    };
  }, []);

  const handleCreateGame = async (invitedId?: number) => {
    try {
      setLoading(true);
      // TODO: Implement game creation logic
      // This will involve showing a deck selection dialog and creating the game
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Error creating game:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="games-container">
      <div className="sidebar">
        <h2>Online Players</h2>
        <div className="clients-list">
          {clients.map(client => (
            <div key={client.clientId} className="client-item">
              <span>{client.username}</span>
              <span>Rank: {client.ranking}</span>
              <button
                onClick={() => handleCreateGame(client.clientId)}
                disabled={loading}
              >
                Invite to Game
              </button>
              <button onClick={() => navigate(`/profile/${client.userId}`)}>
                View Profile
              </button>
              <button onClick={() => navigate(`/message/${client.userId}`)}>
                Send Message
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        <h1>Game Lobby</h1>

        <div className="matchmaking-section">
          {/* TODO: Add MatchmakingLobby component */}
        </div>

        <div className="active-games">
          <h2>Active Games</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Turn</th>
                <th>Player 1</th>
                <th>Player 2</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map(game => (
                <tr key={game.id}>
                  <td>{game.id}</td>
                  <td>{game.turn}</td>
                  <td>{game.player1}</td>
                  <td>{game.player2}</td>
                  <td>
                    <button onClick={() => navigate(`/table/${game.id}`)}>
                      Watch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="recent-matches">
          <h2>Recent Matches</h2>
          {/* TODO: Add MatchTable component */}
        </div>
      </div>
    </div>
  );
};

export default GamesComponent; 