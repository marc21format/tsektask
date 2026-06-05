import React, { useState } from 'react';
import TaskItem from './TaskItem';
import '../styles/tasklist.css';

function TaskList({ category, tasks, onAddTask, onToggleTask, onDeleteTask }) {
  const [newTaskText, setNewTaskText] = useState('');

  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText, category);
      setNewTaskText('');
    }
  };

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>{category}</h2>
        <span className="task-count">{incompleteTasks.length}</span>
      </div>

      {/* Incomplete Tasks */}
      <div className="task-list-items">
        {incompleteTasks.map(task => (
          <TaskItem
            key={task._id}
            task={task}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div className="completed-section">
          <div className="completed-header">COMPLETED</div>
          <div className="completed-tasks">
            {completedTasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
                isCompleted
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Task Input */}
      <form className="add-task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Write a task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          className="add-task-input"
        />
        <button type="submit" className="add-task-button">Add</button>
      </form>
    </div>
  );
}

export default TaskList;
