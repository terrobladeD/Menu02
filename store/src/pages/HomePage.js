import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-page">
      <div className="image-container">
        <img
          src="/restaurant_poster.png"
          alt="resturant img"
          className="w-100"
        />
      </div>
      <div>
        <div className="mt-4">
          <Button as={Link} to="/menu" variant="primary">
            Explore Menu
          </Button>
        </div>
        <div className="mt-4">
          <p>
            Contact us: <br />
            Email: example@example.com <br />
            Phone: +1 (123) 456-7890
          </p>
        </div>
        <div className="mt-4">
          <small>&copy; {new Date().getFullYear()} UpTop. All rights reserved.</small>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
