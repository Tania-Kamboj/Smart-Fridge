import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleCheck, removeFromShoppingList } from '../features/shoppingList/shoppingListSlice';
import { getCategoryById } from '../data/foodCategories';
import './ShoppingListItem.css';

const ShoppingListItem = ({ item }) => {
  const dispatch = useDispatch();
  const category = getCategoryById(item.category);
  
  return (
    <div className={`shopping-item ${item.checked ? 'checked' : ''} ${item.autoAdded ? 'auto-added' : ''}`}>
      <input
        type="checkbox"
        checked={item.checked}
        onChange={() => dispatch(toggleCheck(item.id))}
      />
      <span className="shopping-item-icon">{category.emoji}</span>
      <span className="shopping-item-name">{item.name}</span>
      {item.autoAdded && (
        <span className="auto-added-indicator">Auto</span>
      )}
      <button
        onClick={() => dispatch(removeFromShoppingList(item.id))}
        className="shopping-item-remove"
      >
        ✕
      </button>
    </div>
  );
};

export default ShoppingListItem;