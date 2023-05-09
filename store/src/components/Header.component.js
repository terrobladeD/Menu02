import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';

function Header() {
  const navigate = useNavigate();
  const { storeInfo } = useContext(AppContext);

  return (
    <h3 onClick={() => navigate('/')}>
      {storeInfo ? `${storeInfo.name}` : 'UpTop Demo Restaurant'}
    </h3>
  );
}

export default Header;
