// src/components/AuthForm.tsx
import React, { useState } from 'react';
import axios from 'axios';

const AuthForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // New state for email
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const url = isLogin ? 'http://localhost:3000/api/login' : 'http://localhost:3000/api/register';
      const response = await axios.post(url, { username, password, email: isLogin ? undefined : email }); // Send email only if registering

      if (isLogin) {
        // Store the token in local storage if logging in
        localStorage.setItem('token', response.data.token);
        window.location.href = '/dashboard'; // Redirect to the main page
      } else {
        // Optionally, you can show a success message after registration
        alert('Registration successful! You can now log in.');
        setIsLogin(true); // Switch to login mode after registration
      }
    } catch (err) {
      setError(isLogin ? 'Invalid credentials' : 'Error creating account. Please try again.');
    }
  };


  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="mb-4 text-center">{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleAuth}>
          <div className="mb-3">
            <label className="form-label">Username:</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && ( // Show email input only when registering
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary w-100">
            {isLogin ? 'Login' : 'Register'}
          </button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </form>
        <p className="mt-3 text-center">
          {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
          <button
            className="btn btn-link p-0"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;