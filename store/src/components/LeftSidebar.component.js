import React, { useState, useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import AppContext from '../context/AppContext';

function LeftSidebar({ scrollToTypeRef }) {
  const [isClicked, setIsClicked] = useState(false);
  const { dishTypes } = useContext(AppContext);

  const handleClick = (type) => {
    setIsClicked(!isClicked);
    scrollToTypeRef.current(type);
  };

  return (
    <Navbar
      style={{ backgroundColor: '#f5f5f5', width: "100%", fontSize: "15px", overflowX: 'auto' }}
      variant="light"
    >
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav style={{ display: 'flex', flexDirection: 'row', width: "100%", overflowX: 'auto'}}>
          {dishTypes.map((type, index) => (
            <Nav.Link key={index} style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              textAlign:"center",
              borderRadius: '10px',
              marginRight: '15px',
              whiteSpace: 'nowrap',
              backgroundColor: 'lightgrey'
            }} onClick={() => handleClick(type)}>
              {type}
            </Nav.Link>
          ))}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default LeftSidebar;
