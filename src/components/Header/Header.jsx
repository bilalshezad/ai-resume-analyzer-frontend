import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const name = localStorage.getItem('LoggedInUserName') || '';
  const email = localStorage.getItem('userEmail') || '';

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const handleLogout = () => {
    localStorage.removeItem('Token');
    localStorage.removeItem('LoggedInUserName');
    localStorage.removeItem('UserEmail');
    window.location.href = '/user/login';
  };

  const isJobPage = location && location.pathname && location.pathname.startsWith('/user/add/job');

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="header-nav-btn"
          onClick={() => navigate(isJobPage ? '/user/resume/analyze' : '/user/add/job')}
        >
          {isJobPage ? 'Analyze Resume' : 'Job Tracker'}
        </button>
        <button className="header-logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="header-right">
        <div className="profile">
          <div className="avatar">{initials}</div>
          <div className="profile-info">
            <div className="profile-name">{name || 'User'}</div>
            <div className="profile-email">{email || ''}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
