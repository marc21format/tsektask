# Quick Start Guide

## 🚀 Getting Started with TsekTask

### Step 1: Install Dependencies

```bash
npm install
cd src/client && npm install && cd ../..
```

### Step 2: Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running locally
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tsektask
   ```

### Step 3: Start Development Server

```bash
npm run dev
```

This will automatically:
- Start React dev server (http://localhost:5173)
- Start Express backend (http://localhost:5000)
- Launch Electron app

### Step 4: Try It Out!

1. Add a new task in the "Personal" category
2. Check off tasks to mark them complete
3. Toggle dark mode with the moon icon
4. Create more categories by adding tasks

---

## 🛠️ Common Commands

| Command | What it does |
|---------|------------|
| `npm run dev` | Start all services |
| `npm run dev:client` | React dev server only |
| `npm run dev:server` | Backend only |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run dist` | Create installer |

---

## 🎨 Customizing the Design

All colors and animations are in CSS files:
- `src/client/src/styles/app.css` - Main styles and dark mode colors
- `src/client/src/styles/taskitem.css` - Task animations
- `src/client/src/styles/tasklist.css` - List and form styling

To change colors, edit the CSS variables in `app.css`:
```css
:root {
  --primary-bg: #f5f5f5;
  --primary-text: #333;
  --card-bg: #ffffff;
  --checkbox-color: #4285f4;
}
```

---

## 📦 Building for Distribution

When ready to ship:

```bash
npm run build
npm run dist
```

This creates an `.exe` installer (Windows) in the `dist/` folder.

---

## 🤖 Using the Custom Agent

In VS Code Chat, type:
```
@Full-Stack Task App Builder: [your request]
```

Examples:
- "Create a priority filter component"
- "Add recurring task support to the database"
- "Build a search bar for tasks"
- "Add task due date display"

---

## 🐛 Troubleshooting

**App won't start?**
- Make sure MongoDB is running
- Check `.env` file has correct `MONGODB_URI`
- Try `npm install` again

**Port already in use?**
- Vite: Change port in `src/client/vite.config.js`
- Express: Change PORT in `.env`
- Electron: Usually detects the new Vite port automatically

**Can't see changes?**
- React: Auto-reloads (wait a moment)
- Backend: Restart `npm run dev:server`
- Electron: Reload the window (Ctrl+R or Cmd+R)

---

## 📚 Next Steps

1. ✅ Get it running locally
2. 📝 Add more features using the custom agent
3. 🎨 Customize colors and animations
4. 📦 Build and distribute

Happy coding! 🎉
