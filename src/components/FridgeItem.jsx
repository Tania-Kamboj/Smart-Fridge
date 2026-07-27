import React from 'react';
import { useDispatch } from 'react-redux';
import { removeItem, useItem } from '../features/inventory/inventorySlice';
import { addToShoppingList } from '../features/shoppingList/shoppingListSlice';
import { showNotification } from '../features/ui/uiSlice';
import { getCategoryById } from '../data/foodCategories';
import './FridgeItem.css';

const FridgeItem = ({ item }) => {
  const dispatch = useDispatch();
  const category = getCategoryById(item.category);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  
  const expiryDate = new Date(item.expiryDate);
  expiryDate.setHours(0, 0, 0, 0); 
  
  const timeDiff = expiryDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  let statusClass = 'status-fresh';
  let statusText = `${daysLeft} days left`;
  let statusEmoji = '✅';
  let statusTextClass = 'status-fresh-text';
  
  if (daysLeft < 0) {
    statusClass = 'status-expired';
    statusText = 'Expired';
    statusEmoji = '';
    statusTextClass = 'status-expired-text';
  } else if (daysLeft === 0) {
    statusClass = 'status-expiring';
    statusText = 'Expires today';
    statusEmoji = '⚠️';
    statusTextClass = 'status-expiring-text';
  } else if (daysLeft <= 3) {
    statusClass = 'status-expiring';
    statusText = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
    statusEmoji = '⚠️';
    statusTextClass = 'status-expiring-text';
  }
  
  const handleUse = () => {
    dispatch(useItem(item.id));
    dispatch(showNotification({ message: `Used ${item.name}`, type: 'success' }));
  };
  
  const handleAddToShopping = () => {
    dispatch(addToShoppingList({ name: item.name, category: item.category }));
    dispatch(showNotification({ message: `Added ${item.name} to shopping list`, type: 'success' }));
  };
  
  const handleDelete = () => {
    dispatch(removeItem(item.id));
    dispatch(showNotification({ message: `Removed ${item.name}`, type: 'warning' }));
  };
  
  return (
    <div className={`fridge-item ${statusClass}`}>
      <div className="item-header">
        <div className="item-icon-wrapper">
          {category.emoji}
        </div>
        <div className="item-details">
          <h3 className="item-name">{item.name}</h3>
          <p className="item-quantity">Qty: {item.quantity}</p>
          <div className="item-status">
            <span>{statusEmoji}</span>
            <span className={statusTextClass}>{statusText}</span>
          </div>
          <p className="item-expiry">Expires: {new Date(item.expiryDate).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="item-actions">
        <button onClick={handleUse} className="action-btn btn-use">
          <span>✓</span>
          <span>Use</span>
        </button>
        <button onClick={handleAddToShopping} className="action-btn btn-shop">
          <span>🛒</span>
          <span>Shop</span>
        </button>
        <button onClick={handleDelete} className="action-btn btn-delete">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default FridgeItem;