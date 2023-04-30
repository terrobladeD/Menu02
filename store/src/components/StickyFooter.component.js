import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import AppContext from '../context/AppContext';

function StickyFooter() {
  const { dishes } = useContext(AppContext);
  const navigate = useNavigate();

  const totalItems = dishes.reduce((acc, dish) => acc + dish.quantity, 0);
  const totalPrice = dishes.reduce((acc, dish) => acc + dish.price_cur * dish.quantity, 0);

  const handleClick = () => {
    navigate('/shopping-cart');
  };

  const stickyFooterStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.1)',
  };
  if (totalItems > 0) {
  return (
    <div style={stickyFooterStyle}>
      <Button variant="primary" onClick={handleClick}>
        {`Total Items: ${totalItems} | Total Price: $${totalPrice.toFixed(2)}`}
      </Button>
    </div>
  );}else{return null;}
}

export default StickyFooter;
