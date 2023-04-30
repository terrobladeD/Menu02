import React, { useContext } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import CartItem from '../components/CartItem.component';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function ShoppingCartPage() {
  const { dishes, addToCart, removeFromCart } = useContext(AppContext);
  const cartItems = dishes.filter((dish) => dish.quantity > 0);
  const total = cartItems.reduce((acc, item) => acc + item.price_cur * item.quantity, 0);
  const navigate = useNavigate();

  return (
    <Container>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 && (
        <h2 onClick={() => navigate('/menu')}>Cart is Empty!</h2>
      )}
      {cartItems.map((item) => (
        <Card key={item.id} className="mb-4">
          <Row className="align-items-center">
            <Col xs={12} md={12}>
              <CartItem
                item={item}
                onIncrease={() => addToCart(item)}
                onDecrease={() => removeFromCart(item)}
              />
            </Col>
          </Row>
        </Card>
      ))}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h3>Total: ${total.toFixed(2)}</h3>
        <div>
          <Button variant="primary" onClick={() => navigate('/menu')} className="me-2">
            Add more
          </Button>
          {cartItems.length !== 0 && (
            <Button variant="success" onClick={() => navigate('/checkout')}>
              Checkout
            </Button>
          )}

        </div>
      </div>
    </Container>
  );
}

export default ShoppingCartPage;
