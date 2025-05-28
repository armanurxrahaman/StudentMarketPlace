import React, { createContext, useReducer, useContext, useEffect } from 'react';

/**
 * CartContext - Provides cart functionality throughout the application
 * Uses the same teal/purple color scheme as the Navbar
 */

// Create the context
const CartContext = createContext();

// Initial state for the cart
const initialState = {
  cart: [] // Array of { name, quantity, price, sellerId }
};

/**
 * Cart reducer to handle all cart-related actions
 * @param {Object} state - Current cart state
 * @param {Object} action - Action to perform on the cart
 * @returns {Object} Updated cart state
 */
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Check if item (by name, sellerId, and purchaseRequestId) already exists
      const existingIndex = state.cart.findIndex(
        (item) => item.name === action.payload.name && 
                 item.sellerId === action.payload.sellerId &&
                 item.purchaseRequestId === action.payload.purchaseRequestId
      );
      
      if (existingIndex >= 0) {
        // If exists, update quantity
        const updatedCart = [...state.cart];
        updatedCart[existingIndex].quantity += action.payload.quantity;
        return { cart: updatedCart };
      }
      
      // If not exists, add new item
      return { cart: [...state.cart, action.payload] };
      
    case 'REMOVE_ITEM':
      return {
        cart: state.cart.filter(
          (item) =>
            !(item.name === action.payload.name && 
              item.sellerId === action.payload.sellerId &&
              item.purchaseRequestId === action.payload.purchaseRequestId)
        ),
      };
      
    case 'UPDATE_QUANTITY':
      return {
        cart: state.cart.map((item) =>
          item.name === action.payload.name && 
          item.sellerId === action.payload.sellerId &&
          item.purchaseRequestId === action.payload.purchaseRequestId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
      
    case 'CLEAR_CART':
      return { cart: [] };
      
    default:
      return state;
  }
};

/**
 * CartProvider component that wraps the application
 * Provides cart functionality to all child components
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const CartProvider = ({ children }) => {
  const userId = localStorage.getItem('userId');
  const cartKey = `cart_${userId}`;

  // Initialize state from localStorage if available
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    if (!userId) return initial;
    const persisted = localStorage.getItem(cartKey);
    return persisted ? JSON.parse(persisted) : initial;
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem(cartKey, JSON.stringify(state));
    }
  }, [state, userId, cartKey]);

  /**
   * Add an item to the cart
   * @param {Object} item - Item to add to cart
   */
  const addItemToCart = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  /**
   * Remove an item from the cart
   * @param {Object} item - Item to remove from cart
   */
  const removeItemFromCart = (item) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item });
  };

  /**
   * Update the quantity of an item in the cart
   * @param {string} name - Name of the item
   * @param {string} sellerId - ID of the seller
   * @param {number} quantity - New quantity
   */
  const updateQuantity = (name, sellerId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { name, sellerId, quantity } });
  };

  /**
   * Clear all items from the cart
   */
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Context value with state and methods
  const value = {
    cart: state.cart,
    addItemToCart,
    removeItemFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom hook to use the cart context
 * @returns {Object} Cart context value
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
