document.addEventListener('DOMContentLoaded', () => {
    const activityList = document.getElementById('activity-list');
    const clickCountDisplay = document.getElementById('click-count');
    const keypressCountDisplay = document.getElementById('keypress-count');
    const clearLogsButton = document.getElementById('clear-logs');

    let clickCount = 0;
    let keyPressCount = 0;

    document.addEventListener('click', async () => {
        clickCount++;
        console.log("Mouse click detected in renderer.");
        clickCountDisplay.textContent = `Mouse Clicks: ${clickCount}`;
        await window.electronAPI.trackMouseClick(); // Custom IPC event to save in the main process
    });

    // Fetch and display logs initially
    async function updateActivityLogs() {
        const logs = await window.electronAPI.getActivityData();
        console.log("Activity logs received from main process:", logs);

        activityList.innerHTML = ''; 

        logs.forEach(log => {
            const listItem = document.createElement('li');
            listItem.textContent = `${log.timestamp}: ${log.activity_type} - ${log.detail}`;
            activityList.appendChild(listItem);
        });
    }

    function updateCounts() {
        clickCountDisplay.textContent = `Mouse Clicks: ${clickCount}`;
        keypressCountDisplay.textContent = `Key Presses: ${keyPressCount}`;
    }

    async function refreshCountsAndLogs() {
        const logs = await window.electronAPI.getActivityData();
        clickCount = logs.filter(log => log.activity_type === 'Mouse Click').length;
        keyPressCount = logs.filter(log => log.activity_type === 'Key Press').length;
        updateCounts();
        updateActivityLogs();
    }

    setInterval(refreshCountsAndLogs, 3000);

    // Clear logs when button is clicked
    clearLogsButton.addEventListener('click', async () => {
        console.log("Clear logs button clicked.");
        await window.electronAPI.clearLogs();
        activityList.innerHTML = ''; // Clear UI list
        clickCount = 0;
        keyPressCount = 0;
        updateCounts();
    });

    refreshCountsAndLogs();
});
