const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getActivityData: () => ipcRenderer.invoke('get-activity-data'),
    clearLogs: () => ipcRenderer.invoke('clear-logs'),
    trackMouseClick: () => ipcRenderer.invoke('track-mouse-click'),
});
