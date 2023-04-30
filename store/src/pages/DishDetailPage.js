import React, { useState, useContext } from 'react';
import AppContext from '../context/AppContext';
import { Button, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

function DishDetailPage() {
  const { addToCart, removeFromCart } = useContext(AppContext);
  const location = useLocation();
  const dish = location.state.dish;
  const [quantity, setQuantity] = useState(dish.quantity);

  const handleAddToCart = () => {
    addToCart(dish);
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(dish);
    setQuantity((prevQuantity) => prevQuantity - 1);
  }

  return (
    <div style={{ padding: '8px' }} >
      <Row>
        <Col style={{ paddingTop: '8px', paddingBottom: '8px', display: 'flex', alignItems: 'center' }} xs={3} md={2}>
          <Link to="/menu" style={{ marginRight: 'auto' }}>
            <Button variant="outline-primary">Back</Button>
          </Link>
        </Col>
        <Col xs={9} md={10}>
          <h1 style={{ paddingTop: '8px', paddingBottom: '8px' }}>{dish.name}</h1>
        </Col>
      </Row>
      <div className="align-items-center ">
        <img
          src={dish.image}
          alt={dish.name}
          style={{
            maxWidth: "100%",
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />

      </div>
      <div className="dish-detail-div">
        {dish.price_ori !== dish.price_cur && (
          <span
            style={{
              textDecoration: 'line-through',
              fontSize: '1.6em',
              color: 'grey',
              marginRight: '5px',
            }}
          >
            ${dish.price_ori.toFixed(2)}
          </span>
        )}
        <span style={{ marginRight: '5px', fontSize: '2em' }}>
          ${dish.price_cur.toFixed(2)}
        </span>

      </div>
      <div className="dish-detail-div"><p>{dish.full_description}</p></div>
      <span
        className="d-flex justify-content-end"
        style={{
          position: 'fixed',
          bottom: '0',
          width: '100%',
          padding: '10px 20px 10px 0',
          background: 'white',
          borderTop: '1px solid #ccc',
        }}
      >
        {dish.is_sold_out && (
          <span
            style={{
              fontWeight: 'bold',
              color: 'red',
              marginLeft: '5px',
            }}
          >
            Sold Out
          </span>
        )}
        {!dish.is_sold_out && quantity <= 0 && (
          <Button
            variant="outline-primary"
            onClick={handleAddToCart}
            style={{ fontSize: '11px' }}
          >
            Add to Cart
          </Button>
        )}
        {!dish.is_sold_out && quantity > 0 && (
          <div>
            <Button variant="outline-primary" onClick={handleRemoveFromCart} className="rounded-circle px-2" style={{ fontSize: '11px', marginRight: '5px' }}>
              -
            </Button>
            <span className="mx-2">{quantity}</span>
            <Button variant="outline-primary" onClick={handleAddToCart} className="rounded-circle px-2" style={{ fontSize: '11px' }}>
              +
            </Button>
          </div>
        )}

      </span>
    </div>
  );
}

export default DishDetailPage;
