import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function NavBar() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' && event.newValue === null) {
        navigate('/login');
      }
    };

    const handleClick = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('click', handleClick);
    };
  }, [navigate]);

  return (
    <>
      <nav id="home" className="navbar navbar-expand-lg bg-dark rounded " aria-label="Eleventh navbar example">
        <div className="container-fluid">
          <a className="navbar-brand text-danger fw-bold" href="#home">Roster Radar</a>
          <button className="navbar-toggler bg-danger" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample09" aria-controls="navbarsExample09" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExample09">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-danger" href="#" data-bs-toggle="dropdown" aria-expanded="false">Other</a>
                <ul className="dropdown-menu bg-dark">
                  <li><a className="dropdown-item text-danger" href="https://www.basketball-reference.com/">Basketball Reference</a></li>
                  <li><a className="dropdown-item text-danger" href="https://www.espn.com/fantasy/mens-basketball/">ESPN Fantasy</a></li>
                  <li><a className="dropdown-item text-danger" href="https://x.com/NBA">NBA Twitter</a></li>
                </ul>
              </li>
            </ul>
            <LogoutButton />
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;