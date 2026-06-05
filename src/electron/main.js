const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');
const os = require('os');

const mainLog = path.join(os.tmpdir(), 'tsektask-main.log');
function appendMainLog(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try { fs.appendFileSync(mainLog, line); } catch (e) { console.error('Failed to write main log:', e); }
}

// Disable GPU acceleration to avoid issues on some systems
app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
  console.log('Creating window...');
  const iconPath = isDev
    ? path.join(__dirname, '../../icon/TsekTask.ico')
    : path.join(process.resourcesPath, 'icon', 'TsekTask.ico');

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : path.join(__dirname, '../client/dist/index.html');

  console.log('Loading URL:', startUrl);
  if (isDev) {
    mainWindow.loadURL(startUrl);
  } else {
    mainWindow.loadFile(startUrl);
  }

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
  });

  mainWindow.webContents.on('crashed', () => {
    console.error('Renderer process crashed');
  });

  mainWindow.on('closed', () => {
    console.log('Window closed');
    mainWindow = null;
  });
}

app.on('ready', () => {
  console.log('App ready');
  // In production, start the bundled server so the packaged app can connect to MongoDB
  if (!isDev) {
    try {
      // Look for server file in several locations created by electron-builder
      const candidates = [
        // When asar unpack is used, files are placed in app.asar.unpacked
        path.join(process.resourcesPath, 'app.asar.unpacked', 'src', 'server', 'index.js'),
        // When files are placed under resources/app (not packed)
        path.join(process.resourcesPath, 'app', 'src', 'server', 'index.js'),
        // Direct path relative to this file (useful during some packaging setups)
        path.join(__dirname, '..', 'server', 'index.js'),
      ];

      appendMainLog('Looking for server in candidate paths');
      appendMainLog('MONGODB_URI present: ' + (!!process.env.MONGODB_URI));

      let found = null;
      for (const p of candidates) {
        appendMainLog('Checking: ' + p);
        if (fs.existsSync(p)) { found = p; break; }
      }

      if (!found) {
        appendMainLog('No server file found in candidates. Will still attempt default require.');
      } else {
        appendMainLog('Server file found at: ' + found);
      }

      const toRequire = found || path.join(__dirname, '..', 'server', 'index.js');
      require(toRequire);
      appendMainLog('Server required successfully in production from: ' + toRequire);
      console.log('Server required successfully in production from:', toRequire);
    } catch (err) {
      console.error('Failed to require/start server in production:', err);
      appendMainLog('Failed to require/start server in production: ' + (err && err.message ? err.message : String(err)));
    }
  }

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('uncaught-exception', (error) => {
  console.error('Uncaught exception:', error);
});
