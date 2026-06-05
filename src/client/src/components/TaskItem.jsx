import React, { useState } from 'react';
import { TrashIcon, PencilIcon } from './Icons';
import ConfirmModal from './ConfirmModal';
import '../styles/taskitem.css';

function TaskItem({ task, onToggle, onDelete, onEdit, isCompleted, onDragStart, onDragEnd }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(task._id);
  };

  return (
    <>
      <div
        className={`task-item ${isCompleted ? 'completed' : ''}`}
        draggable
        onDragStart={(e) => onDragStart && onDragStart(e, task._id)}
        onDragEnd={onDragEnd}
      >
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onToggle(task._id, e.target.checked)}
          className="task-checkbox"
        />
        <span className="task-title">{task.title}</span>
        <div className="task-actions">
          <button
            className="task-edit-btn"
            onClick={() => onEdit(task)}
            title="Edit task"
            type="button"
          >
            <PencilIcon />
          </button>
          <button
            className="task-delete-btn"
            onClick={handleDeleteClick}
            title="Delete task"
            type="button"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Task?"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}

export default TaskItem;
