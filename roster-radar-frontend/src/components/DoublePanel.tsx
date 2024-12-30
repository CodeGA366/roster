import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DoublePanelProps {
  onMyRosterClick: () => void;
  onPlayersClick: () => void;
  onTop10PlayersClick: () => void;
}

interface Player {
  id: number;
  playername: string;
  position: string;
  per: number;
  winshares: number;
  box: number;
  team: string;
}

const DoublePanel: React.FC<DoublePanelProps> = ({ onMyRosterClick, onPlayersClick, onTop10PlayersClick }) => {
  const [leftPanelContent, setLeftPanelContent] = useState<React.ReactNode>(null);
  const [rightPanelContent, setRightPanelContent] = useState<React.ReactNode>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [, setTopWinShares] = useState<Player[]>([]);

  // Fetch players from players table
  const fetchPlayers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/players'); // Adjust this URL to match your backend
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched players:', data);
      setPlayers(data); // Assuming data is an array of players
      setRightPanelContent(renderTable('Players', data)); // Set the right panel content here
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  // Fetch top players endpoint
  const fetchTopPlayers = async (metric: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/top-players'); // Adjust this URL to match your backend
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched top players:', data);
      setTopPlayers(data); // Assuming data is an array of players
      setRightPanelContent(renderTable(metric, data)); // Set the right panel content here
    } catch (error) {
      console.error('Error fetching top players:', error);
    }
  };

  // Fetch top winShares endpoint
  const fetchTopWinShares = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/top-winShares'); // Adjust this URL to match your backend
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched top win shares players:', data);
      setTopWinShares(data); // Assuming data is an array of players
      setRightPanelContent(renderTable('Top 10 Players by Win Shares', data)); // Set the right panel content here
    } catch (error) {
      console.error('Error fetching top players:', error);
    }
  };

  const handleBoxClick = async () => {
    await fetchTopBoxScore();
  };
  
  // Fetch top boxScore endpoint
  const fetchTopBoxScore = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/top-boxScore'); // Adjust this URL to match your backend
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched top box score players:', data);
      setTopPlayers(data); // Assuming data is an array of players
      setRightPanelContent(renderTable('Top 10 Players by Box', data)); // Set the right panel content here
    } catch (error) {
      console.error('Error fetching top players:', error);
    }
  };

  // Fetch user players
  async function fetchUserPlayers(userId: number): Promise<Player[]> {
    try {
      const response = await fetch(`http://localhost:3000/api/user_players/${userId}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching players:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched User Players Data:', data);
      return data; // Return the fetched user players
    } catch (error) {
      console.error('Error fetching players:', error);
      return []; // Return an empty array in case of error
    }
  }

  // My roster
  const handleMyRosterClick = async () => {
    const userId = getUserId();
    if (userId) {
      const userPlayers = await fetchUserPlayers(Number(userId)); // Fetch user players
      setPlayers(userPlayers); // Update the players state with user-specific players
      console.log('My Roster Clicked:', userPlayers); // Log players state after fetching
      setLeftPanelContent(
        <div>
          <h1 className="fw-bold">My Roster</h1>
          <div className="bd-example">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Position</th>
                  <th scope="col">Per</th>
                  <th scope="col">Win Shares</th>
                  <th scope="col">Box</th>
                  <th scope="col">Team</th>
                </tr>
              </thead>
              <tbody>
                {userPlayers.map((player, index) => (
                  <tr key={player.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{player.playername}</td>
                    <td>{player.position}</td>
                    <td>{player.per}</td>
                    <td>{player.winshares}</td>
                    <td>{player.box}</td>
                    <td>{player.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else {
      console.error('User ID not found');
    }
    onMyRosterClick();
  };

  const renderTable = (title: string, players: Player[]) => (
    <div>
      <h1 className="fw-bold">{title}</h1>
      <div className="bd-example">
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Position</th>
              <th scope="col">Per</th>
              <th scope="col">Win Shares</th>
              <th scope="col">Box</th>
              <th scope="col">Team</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.id}>
                <th scope="row">{index + 1}</th>
                <td>{player.playername}</td>
                <td>{player.position}</td>
                <td>{player.per}</td>
                <td>{player.winshares}</td>
                <td>{player.box}</td>
                <td>{player.team}</td>
                <td>
                  <button
                    className="btn btn-danger btn-outline-dark m-2"
                    onClick={() => addPlayerToRoster(player.id)}
                  >
                    Add to Roster
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Other rosters


  // Function to get the logged-in user's ID
  interface DecodedToken {
    userId: string; // Assuming the user ID is stored in the token
  }

  const getUserId = (): string | null => {
    const token = localStorage.getItem('token'); // Assuming you stored the token in local storage
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token); // Decode the token and cast to DecodedToken
      return decodedToken.userId; // Assuming the user ID is stored in the 'userId' field
    }
    return null; // Return null if no token is found
  };
  
// add player to roster
  const addPlayerToRoster = async (playerId: number) => {
    const userId = getUserId(); // Get the logged-in user's ID

    if (!userId) {
      console.error('User is not logged in');
      return; // Exit if user ID is not available
    }

    try {
      const response = await fetch('http://localhost:3000/api/user_players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, playerId }),
      });

      if (response.ok) {
        const addedPlayer = await response.json();
        console.log('Player added to roster:', addedPlayer);
        // Optionally, update the UI or notify the user
      } else {
        const error = await response.json();
        console.error('Error adding player:', error);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  // Players
  const handlePlayersClick = async () => {
    await fetchPlayers();
    onPlayersClick();
    console.log('Players Clicked:', players); // Log players state
  };

  // Top 10 Players
  const handleTop10PlayersClick = async () => {
    await fetchTopPlayers('Please Choose a Metric');
    onTop10PlayersClick();
    console.log('Top 10 Players Clicked:', topPlayers); // Log players state
  };

  // PER Filter
  const handlePerClick = async () => {
    await fetchTopPlayers('Top 10 Players by PER');
  };

  // Win Shares Filter
  const handleWinSharesClick = async () => {
    await fetchTopWinShares();
  };


  return (
    <div className="container-fluid">
      <div className="row justify-content-center mt-3">
        <div className="col-md-5 d-flex flex-column align-items-center">
          <div className="btn-group" role="group" aria-label="Basic outlined example">
            <button type="button" className="btn btn-danger btn-outline-dark m-2" onClick={handleMyRosterClick}>
              My Roster
            </button>
          </div>
        </div>
        <div className="col-md-1 d-flex justify-content-center">
          <div className="vertical-line"></div>
        </div>
        <div className="col-md-5 d-flex flex-column align-items-center">
          <div className="btn-group" role="group" aria-label="Basic outlined example">
            <button type="button" className="btn btn-danger btn-outline-dark m-2" onClick={handlePlayersClick}>
              Players
            </button>
            <button type="button" className="btn btn-danger btn-outline-dark m-2" onClick={handleTop10PlayersClick}>
              Top 10 Players
            </button>
          </div>
          <div className="btn-group top-buttons mt-3" role="group" aria-label="Basic outlined example">
            <button type="button" className="btn btn-danger btn-outline-dark m-2" onClick={handlePerClick}>
              PER
            </button>
            <button type="button" className="btn btn-danger btn-outline-dark m-2" onClick={handleWinSharesClick}>
              Win Share
            </button>
            <button type="button" className="btn btn-danger btn-outline-dark m-2" onClick={handleBoxClick}>
              Box
            </button>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6 panel-left text-white">
          {leftPanelContent}
        </div>
        <div className="col-md-6 panel-right text-white">
          {rightPanelContent}
        </div>
      </div>
    </div>
  );
};

export default DoublePanel;