import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

function CartItem({ item, onIncrease, onDecrease }) {
    
  return (
    <Card className="mb-4">
      <Row className="align-items-center">
        <Col xs={4} md={3}>
          <Card.Img
            src={item.image}
            alt={item.name}
            style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
          />
        </Col>
        <Col xs={8} md={9}>
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>{item.description}</Card.Text>
            <Card.Text>
              ${item.price_cur.toFixed(2)}
              <span className="float-end">
                <Button variant="outline-primary" size="sm" style={{ borderRadius: '50%' }} onClick={() => onDecrease(item)}>-</Button>
                <span className="mx-2">{item.quantity}</span>
                <Button variant="outline-primary" size="sm" style={{ borderRadius: '50%' }} onClick={() => onIncrease(item)}>+</Button>
              </span>
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default CartItem;
