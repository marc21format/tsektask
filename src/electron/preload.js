const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Add IPC handlers here if needed
});
