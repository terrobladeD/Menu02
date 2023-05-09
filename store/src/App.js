import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
// import HomeMenuPage from './pages/HomeMenuPage';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import Checkout from './pages/CheckoutPage';
import DishDetailPage from './pages/DishDetailPage';
import Header from './components/Header.component'
import CookieConsent from './components/CookieConsent.component';
import PrivacyPage from './pages/PrivacyPage';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isMobile) {
    return (
      <div className="text-center p-5">
        <h1>This website is only accessible on mobile devices.</h1>
        <p>Please use your mobile phone to access the website.</p>
      </div>
    );
  }

  return (
    <AppProvider>
      <Router>
        <Navbar bg="light" expand="lg" fixed='top' style={{ height: '8vh' }}>
          <Header />
          <CookieConsent />

        </Navbar>
        <main style={{ marginTop: '8vh' }}>
          <Container>
            <Routes>
              <Route exact path="/" element={<HomePage  />} />
              <Route path="/menu" element={<MenuPage  />} />
              <Route path="/shopping-cart" element={<ShoppingCartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dishdetail/:id" element={<DishDetailPage/>} />
              <Route path="/privacy" element={<PrivacyPage />} />
            </Routes>
          </Container>
        </main>
      </Router>
    </AppProvider>
  );
}

export default App;
