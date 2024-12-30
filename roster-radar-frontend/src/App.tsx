// imports
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate
import NavBar from './components/NavBar';
import DoublePanel from './components/DoublePanel';
import FooterSection from './components/FooterSection';
import AuthForm from './components/AuthForm'; // Import AuthForm component
import './App.css';

function App() {
  
  const handleMyRosterClick = () => {
    console.log('My Roster clicked');
  };

  const handlePlayersClick = () => {
    console.log('Players clicked');
  };

  const handleTop10PlayersClick = () => {
    console.log('Pro Rosters clicked');
  };
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login */}
        <Route path="/dashboard" element={
          <>
            <NavBar />
            <DoublePanel onMyRosterClick={handleMyRosterClick}
              onPlayersClick={handlePlayersClick}
              onTop10PlayersClick={handleTop10PlayersClick}/>
            <FooterSection />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;