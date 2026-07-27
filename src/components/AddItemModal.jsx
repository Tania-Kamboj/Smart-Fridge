import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../features/ui/uiSlice';
import { addItem } from '../features/inventory/inventorySlice';
import { categories } from '../data/foodCategories';
import './AddItemModal.css';

const AddItemModal = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    expiryDate: '',
    category: 'other',
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.expiryDate) return;
    
    dispatch(addItem(formData));
    dispatch(closeModal());
  };
  
  const handleClose = () => {
    dispatch(closeModal());
  };
  
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="modal-title-icon">🧊</span>
            Add to Fridge
          </h2>
          <button onClick={handleClose} className="modal-close" aria-label="Close">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              Item Name <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="e.g., Milk, Eggs, Cheese"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Expiry Date <span className="required">*</span>
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="form-input"
              required
            />
          </div>
          
          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="modal-btn modal-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-submit"
            >
              Add Item ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;