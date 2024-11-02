const { BrowserWindow } = require('electron');
const activeWin = require('active-win');

class ActivityTracker {
    constructor(db) {
        this.db = db;
        this.lastActiveWindow = null;
        this.lastLogTime = 0;
        this.cooldown = 30000;
    }

    async startTracking() {
        console.log("Starting activity tracking...");

        // Track key presses and mouse clicks within the application window
        BrowserWindow.getAllWindows().forEach((window) => {
            window.webContents.on('before-input-event', (event, input) => {
                if (input.type === 'keyDown') {
                    console.log(`Key pressed: ${input.key}`);
                    this.db.saveActivityLog('Key Press', `Key ${input.key} pressed`);
                }

                if (input.type === 'mouseDown' && input.button === 'left') {
                    console.log("Mouse click detected");
                    this.db.saveActivityLog('Mouse Click', 'Mouse click detected');
                }
            });
        });

        // Track active application window every 3 seconds
        setInterval(async () => {
            const activeWindow = await activeWin();
            const currentTime = Date.now();

            if (activeWindow) {
                const { title, owner, url } = activeWindow;
                const isNewWindow =
                    !this.lastActiveWindow ||
                    this.lastActiveWindow.title !== title ||
                    this.lastActiveWindow.ownerName !== owner.name ||
                    this.lastActiveWindow.url !== (url || null);

                const isCooldownExpired = (currentTime - this.lastLogTime) > this.cooldown;

                if (isNewWindow || isCooldownExpired) {
                    const activityType = url ? 'Website' : 'Application';
                    const activityDetail = url || `${owner.name} - ${title}`;
                    console.log(`Logging active ${activityType}: ${activityDetail}`);
                    
                    await this.db.saveActivityLog(activityType, activityDetail);
                    this.lastLogTime = currentTime;
                    
                    this.lastActiveWindow = {
                        title: title,
                        ownerName: owner.name,
                        url: url || null,
                    };
                } else {
                    console.log("No significant change detected in active window; skipping log.");
                }
            } else {
                console.log("No active window detected.");
            }
        }, 3000);
    }

    stopTracking() {
        console.log("Stopping activity tracking...");
    }
}

module.exports = ActivityTracker;
