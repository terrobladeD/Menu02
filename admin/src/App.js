import { useState } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import DishPage from './pages/DishPage';
import OrderPage from './pages/OrderPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (authData) {
      const currentTime = new Date().getTime();
      if (authData.expirationTime > currentTime) {
        return true;
      }
    }
    return false;
  });

  const handleLogout = () => {
    localStorage.removeItem('authData');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated && (
        <Navbar bg="light" fixed="top" style={{ height: '8vh', display: 'flex', justifyContent: 'space-between' }}>
          <Nav className="mr-auto" style={{ alignItems: 'center' }}>
            <Nav.Item>
              <Link to="/" className="nav-link" style={{ textDecoration: 'none' }}>
                Admin Panel
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/order" className="nav-link">
                Orders
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/dish" className="nav-link">
                Dishes
              </Link>
            </Nav.Item>
          </Nav>
          <Nav className="mr-auto" style={{margin:'0 8px 0 0'}}>
            <Nav.Item>
              <Button variant="outline-primary" onClick={handleLogout}>
                Log&nbsp;out
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar>
      )}
      <main style={{ marginTop: '8vh' }}>
        <Container>
          <Routes>

            {isAuthenticated ? (
              <>
                <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                <Route exact path="/" element={<HomePage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/dish" element={<DishPage />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </Routes>
        </Container>
      </main>
    </Router>
  );
}

export default App;
