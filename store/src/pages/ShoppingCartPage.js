import React, { useContext } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import CartItem from '../components/CartItem.component';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function ShoppingCartPage() {
  const { cart, addToCart, removeFromCart } = useContext(AppContext);
  // 使用 cart 中的 price 属性直接计算购物车总价
  const total = cart.reduce((acc, item) => {
    const itemTotalPrice = item.price * item.quantity;
    return acc + itemTotalPrice;
  }, 0);
  const navigate = useNavigate();

  function generateCartItemKey(dish, customizes) {
    const customizesIds = customizes.map(customize => customize.id).join('-');
    return `${dish.id}-${customizesIds}`;
  }

  return (
    <Container>
      <h1>Shopping Cart</h1>
      {cart.length === 0 && (
        <h2 onClick={() => navigate('/menu')}>Cart is Empty!</h2>
      )}
      {cart.map((item) => (
        <Card key={generateCartItemKey(item.dish, item.customizes)} className="mb-4">
          <Row className="align-items-center">
            <Col xs={12} md={12}>
              <CartItem
                item={item}
                onIncrease={() => addToCart(item.dish, item.customizes)}
                onDecrease={() => removeFromCart(item.dish, item.customizes)}
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
          {cart.length !== 0 && (
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
