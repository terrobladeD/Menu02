import React, { useState, useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import { Button, Row, Col } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import Customise from '../components/Customise.component';

function DishDetailPage() {
  const navigate = useNavigate();
  const { addToCart } = useContext(AppContext);
  const location = useLocation();
  const dish = location.state.dish;
  const [selectedCustomises, setSelectedCustomises] = useState([]);
  const [totalPrice, setTotalPrice] = useState(dish.price_cur);

  useEffect(() => {
    setTotalPrice(
      dish.price_cur +
      selectedCustomises.reduce((sum, customise) => sum + customise.price, 0)
    );
  }, [selectedCustomises, dish.price_cur]);

  // Check if customise selection is valid
  const isCustomiseSelectionValid = () => {
    if (!dish.customises) {
      return true;
    }

    const customisesByMetaName = dish.customises.reduce((acc, customise) => {
      if (!acc[customise.meta_name]) {
        acc[customise.meta_name] = [];
      }
      acc[customise.meta_name].push(customise);
      return acc;
    }, {});

    return Object.entries(customisesByMetaName).every(([metaName, customises]) => {
      const minSelection = customises[0].meta_min_tk;
      const maxSelection = customises[0].meta_max_tk;
      const selectedCustomisesCount = selectedCustomises.filter((selectedCustomise) =>
        customises.some((customise) => customise.id === selectedCustomise.id)
      ).length;

      return selectedCustomisesCount >= minSelection && selectedCustomisesCount <= maxSelection;
    });
  };

  // Add dish to cart with customises validation 
  const handleAddToCart = (dish, customises) => {
    if (!isCustomiseSelectionValid()) {
      alert('Please select customisation options as required.');
      return;
    }
    addToCart(dish, customises);
    navigate('/menu');
  };

  const handleCustomiseChange = (customise, isSelected) => {
    setSelectedCustomises((prevSelectedCustomises) => {
      if (isSelected) {
        return [...prevSelectedCustomises, customise];
      } else {
        return prevSelectedCustomises.filter((item) => item.id !== customise.id);
      }
    });
  };

  const renderCustomises = () => {
    if (!dish.customises) {
      return null;
    }

    const customisesByMetaName = dish.customises.reduce((acc, customise) => {
      if (!acc[customise.meta_name]) {
        acc[customise.meta_name] = [];
      }
      acc[customise.meta_name].push(customise);
      return acc;
    }, {});

    return Object.entries(customisesByMetaName).map(([metaName, customises]) => (
      <Customise
        key={metaName}
        metaName={metaName}
        customises={customises}
        onCustomiseChange={handleCustomiseChange}
        minSelection={customises[0].meta_min_tk}
        maxSelection={customises[0].meta_max_tk}
      />
    ));
  };

  return (
    <div style={{ padding: '8px' }}>
      <Row>
        <Col style={{ paddingTop: '8px', paddingBottom: '8px', display: 'flex', alignItems: 'center' }} xs={3} md={2}>
          <Link to="/menu" style={{ marginRight: 'auto' }}>
            <Button variant="outline-primary">Back</Button>
          </Link>
        </Col>
        <Col xs={9} md={10}>
          <h1 style={{ paddingTop: '8px', paddingBottom: '8px' }}>{dish.name}</h1>
        </Col>
      </Row>
      <div className="align-items-center ">
        <img
          src={dish.image}
          alt={dish.name}
          style={{
            maxWidth: "100%",
            minWidth: '100%',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />

      </div>
      <div className="dish-detail-div">
        {dish.price_ori !== dish.price_cur && (
          <span
            style={{
              textDecoration: 'line-through',
              fontSize: '1.6em',
              color: 'grey',
              marginRight: '5px',
            }}
          >
            ${dish.price_ori.toFixed(2)}
          </span>
        )}
        <span style={{ marginRight: '5px', fontSize: '2em' }}>
          ${dish.price_cur.toFixed(2)}
        </span>
      </div>
      <div className="dish-detail-div">
        <p>{dish.full_description}</p>
      </div>
      <div className="dish-detail-div">
        {renderCustomises()}
      </div>
      <div style={{ height: '10vh' }}></div>
      <span
        className="d-flex justify-content-end"
        style={{
          position: 'fixed',
          bottom: '0',
          width: '100%',
          padding: '10px 20px 10px 0',
          background: 'white',
          borderTop: '1px solid #ccc',
        }}
      >
        <span
          style={{
            fontSize: '1.2em',
            fontWeight: 'bold',
            marginRight: '10px',
          }}
        >
          ${totalPrice.toFixed(2)}
        </span>
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
        {dish.is_instock && (
          <Button
            variant="outline-primary"
            onClick={() => handleAddToCart(dish, selectedCustomises)}
            style={{ fontSize: '11px' }}
          >
            Add to Cart
          </Button>
        )}
      </span>
    </div>
  );
}

export default DishDetailPage;
