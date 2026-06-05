import React, { useState, useEffect } from 'react';
import '../styles/edittask.css';

function EditTaskModal({ isOpen, task, onClose, onSave, categories = [] }) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setNote(task.note || '');
      setCategory(task.category || '');
    }
  }, [task, isOpen]);

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        ...task,
        title: title.trim(),
        note: note.trim(),
        category: category,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="edit-task-modal">
        <div className="edit-task-header">
          <h3>Edit Task</h3>
          <div className="edit-task-header-buttons">
            <button 
              className="check-btn" 
              onClick={handleSave}
              disabled={!title.trim()}
              title="Save changes"
            >
              ✓
            </button>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
        </div>

        <div className="edit-task-content">
          <div className="form-group-inline">
            <div className="modal-category-selector">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="modal-category-dropdown"
              >
                <option value="">CATEGORY</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="task-title-inline-input"
              placeholder="Task title"
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="task-note-textarea"
              placeholder="Add a note (optional)"
              onKeyDown={handleKeyDown}
              rows="4"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default EditTaskModal;
