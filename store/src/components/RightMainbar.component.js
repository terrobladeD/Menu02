import React, { useContext, useEffect, useRef } from 'react';
import DishItem from './DishItem.component';
import AppContext from '../context/AppContext';

function RightMainbar({ scrollToTypeRef }) {
  const { dishes, dishTypes, addToCart, removeFromCart } = useContext(AppContext);

  // Group dishes by their types
  const groupedDishes = dishTypes.reduce((acc, type) => {
    acc[type.type] = dishes.filter((dish) => {
      const dishType = dishTypes.find((dt) => dt.id === dish.type);
      return dishType && dishType.type === type.type;
    });
    return acc;
  }, {});
  

  const typeRefs = useRef([]);

  useEffect(() => {
    scrollToTypeRef.current = (type) => {
      const index = dishTypes.findIndex((t) => t === type);
      if (typeRefs.current[index]) {
        const headerOffset = (window.innerHeight * 9) / 100 + 50;
        const elementPosition = typeRefs.current[index].offsetTop;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    };
  }, [dishTypes, scrollToTypeRef]);

  return (
    <div style={{ paddingBottom: '10vh' }}>
      {dishTypes.map((type, index) => (
        <div key={type.type} ref={(el) => (typeRefs.current[index] = el)}>
          <h2>{type.type}</h2>
          {groupedDishes[type.type].map((dish) => (
            <DishItem
              key={dish.id}
              dish={dish}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default RightMainbar;
