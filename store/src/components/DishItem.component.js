import React, { useContext } from 'react';
import AppContext from '../context/AppContext';
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function DishItem({ dish, getDishQuantityInCart }) {
  const { handleDishSelect } = useContext(AppContext);
  const dishQuantity = getDishQuantityInCart(dish);

  const navigate = useNavigate();
  const handleItemClick = () => {
    handleDishSelect(dish);
    navigate(`/dishdetail/${dish.id}`, { state: { dish } });
  };

  return (
    <Card className="mb-4" onClick={handleItemClick}>
      <Row className="align-items-center">
        <Col xs={4} md={3} style={{ position: 'relative' }}>
          <Card.Img
            src={dish.image}
            alt={dish.name}
            style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
          />
          {dish.is_instock && dishQuantity > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                backgroundColor: 'grey',
                border: '1px solid white',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '20px',
                color:'white'
              }}
            >
              {dishQuantity}
            </div>
          )}
        </Col>
        <Col xs={8} md={9}>
          <Card.Body>
            <Card.Title>{dish.name}</Card.Title>
            <Card.Text>{dish.description}</Card.Text>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                {dish.price_ori !== dish.price_cur && (
                  <span
                    style={{
                      textDecoration: 'line-through',
                      fontSize: '0.8em',
                      color: 'grey',
                      marginRight: '5px',
                    }}
                  >
                    ${dish.price_ori.toFixed(2)}
                  </span>
                )}
                <span style={{ marginRight: '5px' }}>
                  ${dish.price_cur.toFixed(2)}
                </span>
              </div>

              {!dish.is_instock && (
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
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default DishItem;
