import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import './MainMenu.css';

const MainMenu: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  return (
    <nav className="main-menu">
      <div className="menu-header">
        <Link to="/" className="logo">
          <h1>twinleaf.gg</h1>
        </Link>
      </div>
      <div className="menu-links">
        {isAuthenticated ? (
          <>
            <Link to="/decks" className={`menu-link ${location.pathname === '/decks' ? 'active' : ''}`}>
              <i className="fas fa-layer-group"></i>
              <span>Decks</span>
            </Link>
            <Link to="/table" className={`menu-link ${location.pathname === '/table' ? 'active' : ''}`}>
              <i className="fas fa-gamepad"></i>
              <span>Play</span>
            </Link>
            <Link to="/replays" className={`menu-link ${location.pathname === '/replays' ? 'active' : ''}`}>
              <i className="fas fa-video"></i>
              <span>Replays</span>
            </Link>
            <Link to="/messages" className={`menu-link ${location.pathname === '/messages' ? 'active' : ''}`}>
              <i className="fas fa-envelope"></i>
              <span>Messages</span>
            </Link>
            <Link to="/terms" className={`menu-link ${location.pathname === '/terms' ? 'active' : ''}`}>
              <i className="fas fa-file-alt"></i>
              <span>Terms</span>
            </Link>
            <div className="menu-right">
              <button onClick={() => authService.logout()} className="logout-button">
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </div>
          </>
        ) : (
          <div className="menu-right">
            <Link to="/login" className="menu-link">
              <i className="fas fa-sign-in-alt"></i>
              <span>Login</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainMenu; 