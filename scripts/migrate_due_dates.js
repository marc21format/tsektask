const mongoose = require('mongoose');
(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/tsektask');
    const Task = require('../src/server/models/Task');
    const tasks = await Task.find();
    let count = 0;
    for (const t of tasks) {
      const due = t.dueDate;
      if (typeof due === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(due)) continue;
      const d = new Date(due);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const s = `${y}-${m}-${day}`;
      await Task.updateOne({_id: t._id}, {$set: { dueDate: s }});
      count++;
    }
    console.log('Migrated', count, 'documents');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
