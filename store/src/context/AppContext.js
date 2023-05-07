import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();
const STORAGE_KEY = 'cartItems';
const EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes
const loadCartItemsFromLocalStorage = () => {
  const storedCartData = localStorage.getItem(STORAGE_KEY);

  if (storedCartData) {
    const { data, timestamp } = JSON.parse(storedCartData);
    const currentTime = new Date().getTime();

    if (currentTime - timestamp < EXPIRATION_TIME) {
      return data;
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return [];
};

export const AppProvider = ({ children }) => {
  const [dishes, setDishes] = useState([]);
  const [dishTypes, setDishTypes] = useState([]);
  const [tableNum, setTableNum] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const [cart, setCart] = useState(() => loadCartItemsFromLocalStorage());

  useEffect(() => {
    const currentTime = new Date().getTime();
    const cartDataToStore = JSON.stringify({ data: cart, timestamp: currentTime });

    localStorage.setItem(STORAGE_KEY, cartDataToStore);
  }, [cart]);

  const getDishQuantityInCart = (dish) => {
    let totalQuantity = 0;

    cart.forEach((cartItem) => {
      if (cartItem.dish.id === dish.id) {
        totalQuantity += cartItem.quantity;
      }
    });

    return totalQuantity;
  };

  function handleDishSelect(dish) {
    setSelectedDish(dish);
  }

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        // Fetch dish types
        const responseDishTypes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/dishtype?store_id=store1`);
        const dishTypesData = await responseDishTypes.json();
        // Set dish types
        setDishTypes(dishTypesData);

        // Fetch dishes
        const responseDishes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/dish?store_id=store1`);
        const dishesData = await responseDishes.json();

        const formattedDishes = dishesData.map((dish) => ({
          id: dish.id,
          name: dish.name,
          description: dish.description,
          full_description: dish.full_description,
          price_ori: parseFloat(dish.price_ori),
          price_cur: parseFloat(dish.price_cur),
          is_instock: dish.is_instock,
          image: dish.pict_url,
          type: dish.dishtypeId,
          customises: dish.customises
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
      } catch (error) {
        console.error('Failed to fetch dishes:', error);
      }
    };

    fetchDishes();
    const queryParams = new URLSearchParams(window.location.search);
    const tableNumParam = queryParams.get('table_num');

    if (tableNumParam) {
      setTableNum(tableNumParam);
    }

  }, []);

  //when you want to update the cart item quantities based on both the dish and the selected customizes. It helps to identify the correct cart item to update by checking if the customizes match.
  const customizesAreEqual = (customizes1, customizes2) => {
    if (!customizes1 || !customizes2) {
      return false;
    }

    if (customizes1.length !== customizes2.length) {
      return false;
    }

    const sortedCustomizes1 = customizes1.sort((a, b) => a.id - b.id);
    const sortedCustomizes2 = customizes2.sort((a, b) => a.id - b.id);

    for (let i = 0; i < sortedCustomizes1.length; i++) {
      if (sortedCustomizes1[i].id !== sortedCustomizes2[i].id) {
        return false;
      }
    }

    return true;
  };

  // Updated addToCart function
  const handleAddToCart = (dish, customizes) => {
    // Calculate the total price for the dish including the customizes
    const totalPrice = dish.price_cur + (customizes && customizes.length > 0
      ? customizes.reduce((sum, customize) => sum + customize.price, 0)
      : 0);

    setCart((prevCart) => {
      const existingCartItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.dish.id === dish.id &&
          customizesAreEqual(cartItem.customizes, customizes)
      );

      if (existingCartItemIndex !== -1) {
        const updatedCart = JSON.parse(JSON.stringify(prevCart));
        updatedCart[existingCartItemIndex].quantity += 1;
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            dish,
            customizes,
            quantity: 1,
            price: totalPrice, // Add the total price as a property to the cart item
          }
        ];
      }
    });
  };



  // Updated removeFromCart function
  const handleRemoveFromCart = (dish, customizes) => {
    setCart((prevCart) => {
      const existingCartItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.dish.id === dish.id &&
          customizesAreEqual(cartItem.customizes, customizes)
      );

      if (existingCartItemIndex !== -1) {
        // const updatedCart = [...prevCart];
        const updatedCart = JSON.parse(JSON.stringify(prevCart));
        updatedCart[existingCartItemIndex].quantity -= 1;

        if (updatedCart[existingCartItemIndex].quantity <= 0) {
          updatedCart.splice(existingCartItemIndex, 1);
        }

        return updatedCart;
      } else {
        return prevCart;
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    tableNum,
    dishes,
    dishTypes,
    selectedDish,
    handleDishSelect,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    clearCart,
    cart,
    getDishQuantityInCart
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;