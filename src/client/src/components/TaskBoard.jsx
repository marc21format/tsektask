import React, { useState } from 'react';
import TaskCategory from './TaskCategory';
import '../styles/taskboard.css';

function TaskBoard({ tasks, categories, visibleCategories, selectedCategory, onAddTask, onToggleTask, onDeleteTask, onReorderTasks, onCategoryChange, onEditTask }) {
  const [newTaskText, setNewTaskText] = useState('');
  const [currentCategory, setCurrentCategory] = useState(selectedCategory || (categories && categories.length > 0 ? categories[0] : 'Personal'));

  // Use provided categories, or derive from tasks
  const displayCategories = categories && categories.length > 0 
    ? categories 
    : ['Personal', ...new Set(tasks.map(t => t.category || 'Personal')).filter(c => c !== 'Personal')];

  // Filter to only visible categories
  const visibleCategoryList = visibleCategories && visibleCategories.length > 0
    ? displayCategories.filter(c => visibleCategories.includes(c))
    : displayCategories;

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText, currentCategory || 'Personal');
      setNewTaskText('');
    }
  };

  const handleCategoryChange = (e) => {
    setCurrentCategory(e.target.value);
  };

  const hasAnyTasks = tasks.length > 0;

  return (
    <div className="task-board">
      {!hasAnyTasks && (
        <div className="empty-state">
          <p>No tasks for this day, wooo!</p>
        </div>
      )}
      
      {/* Categories */}
      {visibleCategoryList.map(category => (
        <TaskCategory
          key={category}
          category={category}
          tasks={tasks.filter(t => (t.category || 'Personal') === category)}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onReorderTasks={onReorderTasks}
          onCategoryChange={onCategoryChange}
          onEditTask={onEditTask}
        />
      ))}

      {/* Add Task Form */}
      <form className="add-task-form" onSubmit={handleAddTask}>
        <div className="form-category-selector">
          <select 
            value={currentCategory}
            onChange={handleCategoryChange}
            className="form-category-dropdown"
          >
            {visibleCategoryList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Write a task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          className="add-task-input"
        />
        <button type="submit" className="add-task-btn">Add</button>
      </form>
    </div>
  );
}

export default TaskBoard;

