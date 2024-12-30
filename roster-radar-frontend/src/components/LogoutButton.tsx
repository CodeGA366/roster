import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear user session (e.g., remove token from localStorage)
    navigate('/login'); // Redirect to login page
  };

  return (
    <button className="btn btn-danger text-dark" onClick={handleLogout}>
      Log Out
    </button>
  );
};

export default LogoutButton;