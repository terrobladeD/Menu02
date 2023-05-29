import React, {useContext} from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppContext from '../context/AppContext';

function HomePage() {
  const { storeInfo } = useContext(AppContext);

  return (
    <div className="home-page">
      <div className="image-container">
        <img
          src={storeInfo ? `${storeInfo.top_pict_link}` : "/restaurant_poster.png"}
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
            {storeInfo ? `${storeInfo.description}` : ""}
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
