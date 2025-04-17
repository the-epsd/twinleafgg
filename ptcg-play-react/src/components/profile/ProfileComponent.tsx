import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socketService } from '../../services/socket.service';
import { ApiError } from '../../services/api.error';

interface UserProfile {
  userId: number;
  username: string;
  ranking: number;
  avatar: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  joinDate: string;
}

interface ProfileRequest {
  userId: number;
}

const ProfileComponent: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await socketService.emit<ProfileRequest, UserProfile>('profile:get', { userId: parseInt(userId!) });
        setProfile(userProfile);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const winRate = profile.gamesPlayed > 0
    ? ((profile.gamesWon / profile.gamesPlayed) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={profile.avatar || '/default-avatar.png'}
          alt={`${profile.username}'s avatar`}
          className="profile-avatar"
        />
        <h1>{profile.username}</h1>
        <div className="profile-rank">
          Rank: {profile.ranking}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <h3>Games Played</h3>
          <p>{profile.gamesPlayed}</p>
        </div>
        <div className="stat-item">
          <h3>Games Won</h3>
          <p>{profile.gamesWon}</p>
        </div>
        <div className="stat-item">
          <h3>Games Lost</h3>
          <p>{profile.gamesLost}</p>
        </div>
        <div className="stat-item">
          <h3>Win Rate</h3>
          <p>{winRate}%</p>
        </div>
      </div>

      <div className="profile-info">
        <div className="info-item">
          <h3>Member Since</h3>
          <p>{new Date(profile.joinDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="profile-actions">
        <button onClick={() => window.location.href = `/message/${profile.userId}`}>
          Send Message
        </button>
        <button onClick={() => window.location.href = `/games?invite=${profile.userId}`}>
          Invite to Game
        </button>
      </div>
    </div>
  );
};

export default ProfileComponent; 