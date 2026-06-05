import React, { useState, useEffect } from 'react';
import logo from '../../../icon/TsekTask.ico';
import TaskBoard from './components/TaskBoard';
import DatePicker from './components/DatePicker';
import CategoryManager from './components/CategoryManager';
import EditTaskModal from './components/EditTaskModal';
import EditCategoryModal from './components/EditCategoryModal';
import { MoonIcon, SunIcon, PlusIcon } from './components/Icons';
import './styles/app.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('taskCategories');
    return saved ? JSON.parse(saved) : ['Personal', 'Work', 'Health'];
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const saved = localStorage.getItem('selectedCategory');
    return saved || 'Personal';
  });
  const [visibleCategories, setVisibleCategories] = useState(() => {
    const saved = localStorage.getItem('visibleCategories');
    return saved ? JSON.parse(saved) : ['Personal', 'Work', 'Health'];
  });
  const [editingTask, setEditingTask] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }

    fetchAllTasks();
    fetchTasksByDate(selectedDate);
  }, []);

  const handleAddCategory = (categoryName) => {
    const newCategories = [...categories, categoryName];
    setCategories(newCategories);
    localStorage.setItem('taskCategories', JSON.stringify(newCategories));
    
    const newVisibleCategories = [...visibleCategories, categoryName];
    setVisibleCategories(newVisibleCategories);
    localStorage.setItem('visibleCategories', JSON.stringify(newVisibleCategories));
  };

  const handleToggleCategory = (category) => {
    const isVisible = visibleCategories.includes(category);
    const newVisibleCategories = isVisible
      ? visibleCategories.filter(c => c !== category)
      : [...visibleCategories, category];
    setVisibleCategories(newVisibleCategories);
    localStorage.setItem('visibleCategories', JSON.stringify(newVisibleCategories));
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/category/${encodeURIComponent(categoryToDelete)}`);
      const allTasksInCategory = await response.json();

      for (const task of allTasksInCategory) {
        try {
          await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
            method: 'DELETE',
          });
        } catch (err) {
          console.error('Error deleting task:', err);
        }
      }
    } catch (err) {
      console.error('Error fetching tasks for deletion:', err);
    }

    setTasks(tasks.filter(t => t.category !== categoryToDelete));

    const newCategories = categories.filter(c => c !== categoryToDelete);
    setCategories(newCategories);
    localStorage.setItem('taskCategories', JSON.stringify(newCategories));

    const newVisibleCategories = visibleCategories.filter(c => c !== categoryToDelete);
    setVisibleCategories(newVisibleCategories);
    localStorage.setItem('visibleCategories', JSON.stringify(newVisibleCategories));

    if (selectedCategory === categoryToDelete) {
      const newSelectedCategory = newCategories.length > 0 ? newCategories[0] : 'Personal';
      setSelectedCategory(newSelectedCategory);
      localStorage.setItem('selectedCategory', newSelectedCategory);
    }
  };

  useEffect(() => {
    fetchTasksByDate(selectedDate);
  }, [selectedDate]);

  const fetchAllTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      const data = await response.json();
      setAllTasks(data);
      return data;
    } catch (err) {
      console.error('Error fetching all tasks:', err);
      return [];
    }
  };

  const fetchTasksByDate = async (date) => {
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const response = await fetch(`http://localhost:5000/api/tasks/by-date/${dateStr}`);
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  const handleAddTask = async (title, category) => {
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          category,
          dueDate: dateStr,
        }),
      });
      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      setAllTasks(prev => [newTask, ...prev]);
      await fetchAllTasks();
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleToggleTask = async (taskId, completed) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(t => t._id === taskId ? updatedTask : t));
      await fetchAllTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(t => t._id !== taskId));
      await fetchAllTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleReorderTasks = (draggedTaskId, targetTaskId) => {
    const draggedIndex = tasks.findIndex(t => t._id === draggedTaskId);
    const targetIndex = tasks.findIndex(t => t._id === targetTaskId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);
    setTasks(newTasks);
  };

  const handleCategoryChange = async (taskId, newCategory) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory }),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(t => t._id === taskId ? updatedTask : t));
    } catch (err) {
      console.error('Error updating task category:', err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleSaveEditTask = async (updatedTask) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${updatedTask._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updatedTask.title,
          note: updatedTask.note,
          category: updatedTask.category,
        }),
      });
      const savedTask = await response.json();
      setTasks(tasks.map(t => t._id === updatedTask._id ? savedTask : t));
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
  };

  const handleSaveEditCategory = async (oldName, newName) => {
    try {
      const tasksInCategory = tasks.filter(t => t.category === oldName);
      for (const task of tasksInCategory) {
        await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: newName }),
        });
      }

      const newCategories = categories.map(c => c === oldName ? newName : c);
      setCategories(newCategories);
      localStorage.setItem('taskCategories', JSON.stringify(newCategories));

      const newVisibleCategories = visibleCategories.map(c => c === oldName ? newName : c);
      setVisibleCategories(newVisibleCategories);
      localStorage.setItem('visibleCategories', JSON.stringify(newVisibleCategories));

      if (selectedCategory === oldName) {
        setSelectedCategory(newName);
        localStorage.setItem('selectedCategory', newName);
      }

      setTasks(tasks.map(t => t.category === oldName ? { ...t, category: newName } : t));

      setEditingCategory(null);
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const getTaskCountForCategoryAllDates = async (category) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/category/${encodeURIComponent(category)}`);
      const data = await response.json();
      return data.length;
    } catch (err) {
      console.error('Error fetching tasks:', err);
      return 0;
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
            <div className="header-left">
              <img src={logo} className="app-logo" alt="TsekTask" />
              <h1 className="app-title">TsekTask</h1>
            </div>
        <div className="header-buttons">
          <button className="header-btn" onClick={() => setShowCategoryManager(!showCategoryManager)} title="Manage categories">
            <PlusIcon />
          </button>
          <button className="header-btn" onClick={toggleTheme} title="Toggle dark mode">
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>
      <main className="app-main">
        <DatePicker selectedDate={selectedDate} onDateSelect={setSelectedDate} tasks={allTasks} />
        <TaskBoard
          tasks={tasks}
          categories={categories}
          visibleCategories={visibleCategories}
          selectedCategory={selectedCategory}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onReorderTasks={handleReorderTasks}
          onCategoryChange={handleCategoryChange}
          onEditTask={handleEditTask}
        />
      </main>
      <CategoryManager
        isOpen={showCategoryManager}
        categories={categories}
        visibleCategories={visibleCategories}
        tasks={tasks}
        onClose={() => setShowCategoryManager(false)}
        onAddCategory={handleAddCategory}
        onToggleCategory={handleToggleCategory}
        onDeleteCategory={handleDeleteCategory}
        onEditCategory={handleEditCategory}
        getTaskCountForCategoryAllDates={getTaskCountForCategoryAllDates}
      />
      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEditTask}
        categories={categories}
      />
      <EditCategoryModal
        isOpen={!!editingCategory}
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onSave={handleSaveEditCategory}
      />
    </div>
  );
}

export default App;
