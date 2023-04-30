import React,{useContext}  from 'react';
import AppContext from '../context/AppContext';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function DishItem({ dish, onAddToCart, onRemoveFromCart}) {
  const {handleDishSelect} = useContext(AppContext);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(dish);
  };

  const handleRemoveFromCart = (e) => {
    e.stopPropagation();
    onRemoveFromCart(dish);
  };

  const navigate = useNavigate();
  const handleItemClick = () => {
    handleDishSelect(dish)
    navigate(`/dishdetail/${dish.id}`,{state:{dish}});
  };

  return (
    <Card className="mb-4" onClick={handleItemClick} >
      <Row className="align-items-center" >
        <Col xs={4} md={3} >
          <Card.Img
            src={dish.image}
            alt={dish.name}
            style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
          />
        </Col>
        <Col xs={8} md={9}>
          <Card.Body>
            <Card.Title>{dish.name}</Card.Title>
            <Card.Text>{dish.description}</Card.Text>
            <div className="d-flex align-items-center justify-content-between">
            <div>
            {dish.price_ori !== dish.price_cur && (
                <span style={{ textDecoration: 'line-through', fontSize: '0.8em', color: 'grey', marginRight: '5px' }}>
                  ${dish.price_ori.toFixed(2)}
                </span>
              )}
              <span style={{ marginRight: '5px' }}>${dish.price_cur.toFixed(2)}</span>
            </div>

              {!dish.is_sold_out && dish.quantity === 0 && (
                <Button variant="outline-primary" onClick={handleAddToCart} className="rounded-circle px-2" style={{ fontSize: '11px' }}>
                  +
                </Button>
              )}
              {!dish.is_sold_out && dish.quantity > 0 && (
                <div>
                  <Button variant="outline-primary" onClick={handleRemoveFromCart} className="rounded-circle px-2" style={{ fontSize: '11px', marginRight: '5px' }}>
                    -
                  </Button>
                  <span className="mx-2">{dish.quantity}</span>
                  <Button variant="outline-primary" onClick={handleAddToCart} className="rounded-circle px-2" style={{ fontSize: '11px' }}>
                    +
                  </Button>
                </div>
              )}
              {dish.is_sold_out && (
                <span style={{ fontWeight: 'bold', color: 'red', marginLeft: '5px' }}>Sold Out</span>
              )}
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default DishItem;
