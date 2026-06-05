import React, { useState, useEffect } from 'react';
import '../styles/editcategory.css';

function EditCategoryModal({ isOpen, category, onClose, onSave }) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (category) {
      setName(category);
    }
  }, [category, isOpen]);

  const handleSave = () => {
    if (name.trim() && name.trim() !== category) {
      onSave(category, name.trim());
    } else {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen || !category) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="edit-category-modal">
        <div className="edit-category-header">
          <h3>Edit Category</h3>
          <div className="edit-category-header-buttons">
            <button 
              className="check-btn" 
              onClick={handleSave}
              disabled={!name.trim() || name.trim() === category}
              title="Save changes"
            >
              ✓
            </button>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
        </div>

        <div className="edit-category-content">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="category-name-inline-input"
            placeholder="Category name"
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>
    </>
  );
}

export default EditCategoryModal;
