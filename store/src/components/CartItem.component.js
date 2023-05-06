import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

function CartItem({ item, onIncrease, onDecrease }) {
  const dish = item.dish;

  const customizesTotalPrice = item.customizes.reduce(
    (acc, customize) => acc + customize.price,
    0
  );
  const itemTotalPrice = (dish.price_cur + customizesTotalPrice) * item.quantity;

  return (
    <Card>
      <Row className="align-items-start">
        <Col xs={3} md={2}>
          <Card.Img
            src={dish.image}
            alt={dish.name}
            style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
          />
        </Col>
        <Col xs={9} md={10} className="d-flex flex-column justify-content-between">
          <div>
            <Card.Body className="d-flex flex-column align-items-start">
              <Card.Title>{dish.name}</Card.Title>
              <Card.Text>{dish.description}</Card.Text>
              {item.customizes && item.customizes.length > 0 && (
                <Card.Text>
                  <strong>Customises:</strong>
                  <div>
                    {item.customizes.map((customize, index) => (
                      <p style={{ margin: '0' }} key={`${customize.id}-${index}`}>{customize.name} (${customize.price.toFixed(2)})</p>
                    ))}
                  </div>
                </Card.Text>
              )}

            </Card.Body>
          </div>
          <Card.Body className="d-flex justify-content-between align-items-center mb-0">
            <span>Total: ${itemTotalPrice.toFixed(2)}</span>
            <div
              style={{
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Button
                variant="outline-primary"
                size="sm"
                style={{
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  padding: '0',
                  fontSize: '12px',
                  lineHeight: '24px'
                }}
                onClick={onDecrease}
              >
                -
              </Button>
              <span className="mx-2">{item.quantity}</span>
              <Button
                variant="outline-primary"
                size="sm"
                style={{
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  padding: '0',
                  fontSize: '12px',
                  lineHeight: '24px'
                }}
                onClick={() => {
                  // console.log('onIncrease called from:', new Error().stack);
                  onIncrease();
                }}
              >
                +
              </Button>


            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default CartItem;
