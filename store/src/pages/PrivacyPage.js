import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const PrivacyPage = () => {
  return (
    <Container style={{ padding: '20px' }}>
      <h1>Privacy Policy</h1>
      {/* You can replace this with your own content */}
      <p>
        This privacy policy describes how Uptop Eats collects, uses, and shares information about you when
        you visit our website or use our services. By using our website, you agree to the terms of this
        policy.
      </p>
      <h2>Information We Collect</h2>
      <p>
        We collect various types of information from you, including personal data, such as your name, email
        address, and phone number, as well as non-personal data, such as your browsing habits and
        preferences. We may also collect information about your device, such as IP address, browser type,
        and operating system.
      </p>
      <h2>Your Choices</h2>
      <p>
        You have the right to access, update, or delete your personal information at any time. If you
        would like to exercise these rights or have any questions about our privacy practices, please
        contact us at: abcd@1234.com.au
      </p>
      <Link to="/" className="btn btn-primary">
        <i className="fas fa-arrow-left"></i> Back
      </Link>
    </Container>
  );
};

export default PrivacyPage;
