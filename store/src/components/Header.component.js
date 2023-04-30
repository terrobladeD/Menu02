import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  return <h3 onClick={() => navigate('/')}>UpTop Demo Restaurant</h3>;
}

export default Header;