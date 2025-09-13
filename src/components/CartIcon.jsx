import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CartIcon = () => {
  const { cart } = useCart();
  const totalItems = cart.totalItems;

  return (
    <Link
      to="/cart"
      className="relative flex items-center justify-center p-2 text-gray-600 hover:text-orange-500 transition-colors"
      title="Shopping Cart"
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
