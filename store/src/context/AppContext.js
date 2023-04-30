import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [dishes, setDishes] = useState([]);
  const [dishTypes, setDishTypes] = useState([]);
  const [tableNum, setTableNum] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);

  function handleDishSelect(dish) {
    setSelectedDish(dish);
  }

  useEffect(() => {
    const fetchDishes = async () => {
      try {

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/dish?store_id=store1`);
        const data = await response.json();

        const formattedDishes = data.map((dish) => ({
          id: dish.id,
          name: dish.name,
          description: dish.description,
          full_description: dish.full_description,
          price_ori: parseFloat(dish.price_ori),
          price_cur: parseFloat(dish.price_cur),
          is_sold_out: dish.is_sold_out,
          image: dish.pict_url,
          quantity: 0,
          type: dish.type
        }));

        formattedDishes.sort((a, b) => {
          if (a.type < b.type) {
            return -1;
          }
          if (a.type > b.type) {
            return 1;
          }
          return 0;
        });

        setDishes(formattedDishes);
        const uniqueTypes = [...new Set(formattedDishes.map((dish) => dish.type))];
        setDishTypes(uniqueTypes);

      } catch (error) {
        console.error('Failed to fetch dishes:', error);
      }
    };

    fetchDishes();
    const queryParams = new URLSearchParams(window.location.search);
    const tableNumParam = queryParams.get('tablenum');

    if (tableNumParam) {
      setTableNum(tableNumParam);
    }

  }, []);

  const handleAddToCart = (dish) => {
    setDishes((prevDishes) => {
      const updatedDishes = prevDishes.map((d) => (d.id === dish.id ? { ...d, quantity: d.quantity + 1 } : d));
      localStorage.setItem('dishes', JSON.stringify(updatedDishes));
      return updatedDishes;
    });
  };

  const handleRemoveFromCart = (dish) => {
    setDishes((prevDishes) => {
      const updatedDishes = prevDishes.map((d) =>
        d.id === dish.id ? { ...d, quantity: Math.max(d.quantity - 1, 0) } : d,
      );
      localStorage.setItem('dishes', JSON.stringify(updatedDishes));
      return updatedDishes;
    });
  };

  const clearDishes = () => {
    setDishes((prevDishes) => prevDishes.map((dish) => ({ ...dish, quantity: 0 })));
  };

  const value = {
    tableNum,
    dishes,
    dishTypes,
    selectedDish,
    handleDishSelect,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    clearDishes
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;