import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);

        // Store the token and expiration time in localStorage
        const expiresIn = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        const expirationTime = new Date().getTime() + expiresIn;
        const authData = {
          token: data.token,
          expirationTime,
        };
        localStorage.setItem('authData', JSON.stringify(authData));
        localStorage.setItem('storeId', JSON.stringify(data.storeId));

        navigate('/');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred while logging in. Please try again.');
    }
  };

  return (
    <Container>
      <h1>Login</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop:'16px'}}>
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
