import React, { useState } from 'react';
import TaskItem from './TaskItem';
import '../styles/taskcategory.css';

function TaskCategory({ category, tasks, onToggleTask, onDeleteTask, onReorderTasks, onCategoryChange, onEditTask }) {
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverTaskId, setDragOverTaskId] = useState(null);

  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const handleDragStart = (e, taskId, taskCategory) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('taskCategory', taskCategory);
  };

  const handleDragOver = (e, targetTaskId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (targetTaskId) {
      setDragOverTaskId(targetTaskId);
    }
  };

  const handleDrop = (e, targetTaskId) => {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData('taskId');
    const draggedCategory = e.dataTransfer.getData('taskCategory');
    
    if (draggedCategory !== category && onCategoryChange) {
      onCategoryChange(draggedTaskId, category);
    } else if (draggedTaskId && draggedTaskId !== targetTaskId && onReorderTasks) {
      onReorderTasks(draggedTaskId, targetTaskId);
    }
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  const handleCategoryDrop = (e) => {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData('taskId');
    const draggedCategory = e.dataTransfer.getData('taskCategory');
    
    if (draggedCategory !== category && onCategoryChange) {
      onCategoryChange(draggedTaskId, category);
    }
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  if (incompleteTasks.length === 0 && completedTasks.length === 0) {
    return null;
  }

  const allTasks = [...incompleteTasks, ...completedTasks];

  return (
    <div 
      className="task-category"
      onDragOver={handleDragOver}
      onDrop={handleCategoryDrop}
    >
      <div className="category-header">
        <h2>
          {category}
          <span className="category-task-count">{incompleteTasks.length}</span>
          {completedTasks.length > 0 && (
            <span className="category-task-count-completed">{completedTasks.length}</span>
          )}
        </h2>
      </div>

      {/* All Tasks */}
      <div className="tasks-list">
        {allTasks.map((task) => (
          <div
            key={task._id}
            className={`task-item-wrapper ${draggedTaskId === task._id ? 'dragging' : ''} ${dragOverTaskId === task._id ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, task._id)}
            onDrop={(e) => handleDrop(e, task._id)}
            onDragLeave={() => setDragOverTaskId(null)}
          >
            <TaskItem
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
              isCompleted={task.completed}
              onDragStart={(e) => handleDragStart(e, task._id, task.category || 'Personal')}
              onDragEnd={handleDragEnd}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskCategory;
