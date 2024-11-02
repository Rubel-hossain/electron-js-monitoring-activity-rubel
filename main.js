const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ActivityTracker = require('./activityTracker');
const Database = require('./database');

let mainWindow;
const db = new Database();
const activityTracker = new ActivityTracker(db);

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();
    activityTracker.startTracking();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});

// IPC event listeners for retrieving and clearing data
ipcMain.handle('get-activity-data', async () => {
    return await db.getRecentActivityLogs();
});

ipcMain.handle('clear-logs', async () => {
    await db.clearLogs();
});

ipcMain.handle('track-mouse-click', async () => {
    await db.saveActivityLog('Mouse Click', 'Mouse click detected');
});
