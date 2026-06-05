const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

const toDateKey = (value) => {
  if (!value) return '';
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks.map(task => ({ ...task.toObject(), dueDate: toDateKey(task.dueDate) })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET tasks by date
router.get('/by-date/:date', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks
      .map(task => ({ ...task.toObject(), dueDate: toDateKey(task.dueDate) }))
      .filter(task => task.dueDate === req.params.date));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET tasks by category
router.get('/category/:category', async (req, res) => {
  try {
    const tasks = await Task.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new task
router.post('/', async (req, res) => {
  let dueDate;
  if (req.body.dueDate) {
    dueDate = req.body.dueDate;
  } else {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dueDate = `${year}-${month}-${day}`;
  }

  const task = new Task({
    title: req.body.title,
    category: req.body.category || 'Personal',
    dueDate: dueDate,
  });

  try {
    const newTask = await task.save();
    const output = newTask.toObject();
    output.dueDate = toDateKey(output.dueDate);
    res.status(201).json(output);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a task
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.body.title) task.title = req.body.title;
    if (req.body.completed !== undefined) {
      task.completed = req.body.completed;
      task.completedAt = req.body.completed ? new Date() : null;
    }
    if (req.body.category) task.category = req.body.category;
    if (req.body.note !== undefined) task.note = req.body.note;
    if (req.body.dueDate) {
      task.dueDate = req.body.dueDate;
    }

    const updatedTask = await task.save();
    const output = updatedTask.toObject();
    output.dueDate = toDateKey(output.dueDate);
    res.json(output);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
