import React, { useContext, useState } from 'react';
import { Button, Form, Row, Col, Modal } from 'react-bootstrap';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const { dishes, tableNum, clearDishes } = useContext(AppContext);
  const [inputTableNum, setInputTableNum] = useState(tableNum || '');
  const [email, setEmail] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);

  const totalFoodPrice = dishes.reduce((acc, dish) => acc + dish.price_cur * dish.quantity, 0);
  const transactionFee = totalFoodPrice < 50 ? totalFoodPrice * 0.05 : totalFoodPrice * 0.02;
  const totalPrice = totalFoodPrice + transactionFee;

  const paddingTopBottom = { paddingTop: '8px', paddingBottom: '8px' };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      total_price: totalPrice,
      table_num: parseInt(inputTableNum, 10),
      email: email,
      additional_info: additionalInfo,
      details: dishes
        .filter((dish) => dish.quantity > 0)
        .map((dish) => ({ quantity: dish.quantity, dishId: dish.id })),
    };

    try {
      const response = await fetch('${process.env.REACT_APP_API_BASE_URL}/api/order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        // handle the form submission and proceed to the payment gateway
        alert('Payment finished');
        clearDishes();
        navigate('/');
      } else {
        alert('Error submitting the order');
      }
    } catch (error) {
      alert('Error submitting the order');
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleAddMoreClick = () => {
    setShowPopup(false);
    navigate('/menu');
  };

  return (
    <div style={{ padding: '8px' }}>
      <Row>
        <Col style={paddingTopBottom} xs={4} md={3}>
          <Button variant="outline-secondary" onClick={() => navigate('/shopping-cart')}>
            Back
          </Button>
        </Col>
        <Col xs={8} md={9}>
          <h1 style={paddingTopBottom}>Checkout</h1>
        </Col>
      </Row>
      <p>Total Food Price: ${totalFoodPrice.toFixed(2)}</p>
      <p>Transaction Fee: ${transactionFee.toFixed(2)}</p>
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Table Number</Form.Label>
          <Form.Control
            type="number"
            value={inputTableNum}
            onChange={(e) => setInputTableNum(e.target.value)}
            required={!tableNum}
            readOnly={!!tableNum}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Additional Information</Form.Label>
          <Form.Control
            as="textarea" rows={3}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop: '24px' }}>
          Proceed to Payment
        </Button>
      </Form>

      {totalFoodPrice < 50 && (
        <Modal show={showPopup} onHide={handlePopupClose}>
          <Modal.Header closeButton>
            <Modal.Title>Low Total Food Price</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Your total food price is less than $50.</p>
            <p>Our transcation fee is 5% of the total price if it's less than 50.</p>
            <p>Do you want to add more to make the transaction fee lower?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleAddMoreClick}>
              Yes
            </Button>
            <Button variant="secondary" onClick={handlePopupClose}>
              No
            </Button>

          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Checkout;

