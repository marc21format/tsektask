import React, { useState } from 'react';
import { TrashIcon, PencilIcon } from './Icons';
import ConfirmModal from './ConfirmModal';
import '../styles/categorymanager.css';

function CategoryManager({ isOpen, categories, visibleCategories, tasks, onClose, onAddCategory, onToggleCategory, onDeleteCategory, onEditCategory, getTaskCountForCategoryAllDates }) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTaskCountForCategory, setDeleteTaskCountForCategory] = useState(0);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  const handleCategoryToggle = (category) => {
    onToggleCategory(category);
  };

  const getTaskCountForCategory = (category) => {
    return tasks.filter(t => t.category === category).length;
  };

  const handleDeleteClick = async (category) => {
    setCategoryToDelete(category);
    // Fetch task count for this category across all dates
    const count = await getTaskCountForCategoryAllDates(category);
    setDeleteTaskCountForCategory(count);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete);
      setCategoryToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setCategoryToDelete(null);
    setShowDeleteConfirm(false);
  };

  const buildDeleteMessage = () => {
    if (!categoryToDelete) return '';
    const taskCount = deleteTaskCountForCategory;
    if (taskCount === 0) {
      return `Are you sure you want to delete "${categoryToDelete}"?`;
    } else if (taskCount === 1) {
      return `Are you sure you want to delete "${categoryToDelete}"? This will also delete 1 task in this category (including tasks from other dates).`;
    } else {
      return `Are you sure you want to delete "${categoryToDelete}"? This will also delete ${taskCount} tasks in this category (including tasks from other dates).`;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="category-overlay" onClick={onClose}></div>
      <div className="category-popup">
        <div className="category-popup-header">
          <h3>Task Categories</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="category-list">
          {categories.map(category => {
            const isVisible = visibleCategories.includes(category);
            return (
              <div key={category} className="category-item-container">
                <label className="category-item">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => handleCategoryToggle(category)}
                    className="category-checkbox"
                  />
                  <span className="category-name">{category}</span>
                </label>
                <div className="category-actions">
                  <button
                    className="category-edit-btn"
                    onClick={() => onEditCategory(category)}
                    title="Edit category"
                    type="button"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    className="category-delete-btn"
                    onClick={() => handleDeleteClick(category)}
                    title="Delete category"
                    type="button"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="category-input-section">
          <input
            type="text"
            placeholder="New category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="category-input"
          />
          <button 
            className="add-category-btn"
            onClick={handleAddCategory}
            type="button"
          >
            Add
          </button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <ConfirmModal
          isOpen={showDeleteConfirm}
          title="Delete Category"
          message={buildDeleteMessage()}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
}

export default CategoryManager;
