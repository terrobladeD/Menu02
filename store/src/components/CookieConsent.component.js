// components/CookieConsent.js
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const [necessaryChecked] = useState(true);
  const [analyticalChecked, setAnalyticalChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);

  const handleClose = () => {
    if (necessaryChecked && analyticalChecked && marketingChecked) {
      setShow(false);
      localStorage.setItem('cookieConsent', 'true');
    } else {
      alert('Please accept all cookies to continue.');
    }
  };

  useEffect(() => {
    const isConsentGiven = localStorage.getItem('cookieConsent');
    if (!isConsentGiven) {
      setShow(true);
    }
  }, []);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Our website uses cookies</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          UpTop Eats would like to use our own and third party cookies and similar technologies for
          statistics and marketing purposes. You can set your preferences by selecting the options
          below. Withdraw your consent at any time via the shield icon.
        </p>
        <Form>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="necessaryCookies"
              label="Necessary cookies help with the basic functionality of our website, e.g. remember if you gave consent to cookies."
              checked={necessaryChecked}
              onChange={(e) => {}}
              
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="analyticalCookies"
              label="Analytical cookies make it possible to gather statistics about the use and traffic on our website, so we can make it better."
              checked={analyticalChecked}
              onChange={(e) => setAnalyticalChecked(e.target.checked)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="marketingCookies"
              label="Marketing cookies make it possible to show you more relevant social media content and advertisements on our website and other platforms."
              checked={marketingChecked}
              onChange={(e) => setMarketingChecked(e.target.checked)}
            />
          </Form.Group>
        </Form>
        <p>
          Learn more about how we use cookies and who sets cookies on our website in our{' '}
          <Link to="/privacy" onClick={handleClose}>
            Privacy Policy
          </Link>
          .
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          I Accept
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CookieConsent;
