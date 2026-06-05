# TsekTask - Desktop Task Management App

A beautiful, animated task management desktop application built with Electron, React, Express, and MongoDB.

## Features

✨ **Beautiful UI with Animations** - Smooth transitions and engaging interactions  
🌙 **Dark Mode Support** - Easy on the eyes  
✅ **Task Management** - Create, complete, and delete tasks  
📂 **Categories** - Organize tasks by category  
⏰ **Recurring Tasks** - Set tasks to repeat (daily, weekly, monthly)  
⚡ **Fast & Responsive** - Lightweight desktop app  

## Project Structure

```
tsektask/
├── src/
│   ├── client/              # React frontend (Electron renderer)
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── styles/      # CSS files
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   └── package.json
│   ├── server/              # Express backend
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   └── index.js         # Entry point
│   └── electron/            # Electron main process
│       ├── main.js
│       └── preload.js
├── .github/
│   └── agents/              # Custom agents
│       └── fullstack-task-builder.agent.md
├── package.json
├── .env
└── .gitignore
```

## Installation

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas connection)

### Setup

1. **Clone & Install**
   ```bash
   cd tsektask
   npm install
   cd src/client && npm install && cd ../..
   ```

2. **Configure MongoDB**
   Edit `.env` and set your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/tsektask
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

   This will start:
   - React dev server (port 5173)
   - Express backend (port 5000)
   - Electron app

## Available Scripts

- `npm run dev` - Start all services in development mode
- `npm run dev:client` - React dev server only
- `npm run dev:server` - Express server only
- `npm run build` - Build for production
- `npm start` - Run production app
- `npm run pack` - Package app
- `npm run dist` - Create distributable

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/category/:category` - Get tasks by category
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Task Schema

```javascript
{
  title: String,           // Task title
  category: String,        // Task category (default: "Personal")
  completed: Boolean,      // Completion status
  recurrence: String,      // 'none', 'daily', 'weekly', 'monthly'
  dueDate: Date,          // Optional due date
  priority: String,       // 'low', 'medium', 'high'
  createdAt: Date,        // Auto-set
  completedAt: Date       // Auto-set when completed
}
```

## Using the Custom Agent

Use the **Full-Stack Task App Builder** agent in Copilot Chat to:
- Build UI components with animations
- Create Express routes
- Design MongoDB schemas
- Implement features

Example: *"Create a React component for adding a new task with a smooth slide-in animation"*

## Development Tips

- **Frontend**: React components are in `src/client/src/components/`
- **Styling**: CSS files in `src/client/src/styles/` support dark mode via CSS variables
- **Backend**: Express routes in `src/server/routes/`
- **Database**: MongoDB models in `src/server/models/`

## Building for Distribution

```bash
npm run build
npm run dist
```

This creates an executable installer in `dist/`

## License

MIT

---

**Ready to build!** 🚀 Start using the custom agent to expand features.
