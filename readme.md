# Electron Activity Monitor By Rubel Hossain

This Electron-based desktop application tracks mouse clicks, keyboard activity, and records visited applications and website URLs. It stores this activity data locally, displays it in a simple dashboard UI, and offers options to clear logs and visualize activity data over time.

## Features

- **Mouse & Keyboard Activity**: Tracks and displays the total number of mouse clicks and keyboard key presses.
- **Application & Website Logging**: Logs visited applications and websites (URLs in supported browsers) with timestamps.
- **Data Storage**: Stores data locally using SQLite.
- **Dashboard UI**: Displays click and keypress counts, recent applications and websites visited.
- **Visualization**: Optionally includes basic data visualization (using Chart.js).
- **Log Management**: Users can clear logs through the UI.
- **Cross-Platform Compatibility**: Works on both Windows and macOS.

## Technologies Used

- **Electron**: Cross-platform framework for building desktop applications with JavaScript, HTML, and CSS.
- **SQLite**: Local storage solution for saving activity logs.
- **Chart.js**: Data visualization library for activity analytics (optional).
- **iohook** (optional): Library for global keyboard and mouse event tracking.
  
## Installation

### Prerequisites

- **Node.js** (v14 or later)
- **Electron** (latest version compatible with the project)

### Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/electron-activity-monitor.git
    cd electron-activity-monitor
    ```

2. Install dependencies:

    ```bash
    npm install
    ```


## Usage

### Running the Application

Start the application in development mode:

```bash
npm start
```

### Building the Application

To package the application for distribution, use the following command:

```bash
npm run build
```

This will create a platform-specific build in the `build` directory.

## File Structure

```plaintext
.
├── main.js                # Main process: handles window creation and IPC communication
├── preload.js             # Preload script: exposes secure APIs to the renderer process
├── renderer.js            # Renderer process: manages UI updates and data fetching
├── activityTracker.js     # Logic for tracking mouse clicks, keypresses, and active applications
├── database.js            # SQLite database management for storing logs
├── index.html             # HTML structure for the dashboard UI
├── styles.css             # CSS styling for the dashboard UI
├── README.md              # Project documentation
└── package.json           # Project metadata and dependencies
```

## Application Overview

### 1. Mouse & Keyboard Click Counter

Tracks the total number of:
- Mouse clicks: Captured by adding an event listener to the renderer process.
- Keyboard key presses: Logged in the database and displayed in the UI.

### 2. Activity Logging

Logs each active application or visited URL (on supported browsers):
- Uses `active-win` to get details of the current active window every few seconds.
- Only logs changes in the active window or if a cooldown period has passed.

### 3. Storage

- All activity data is stored in a local SQLite database (`activity_logs.db`).
- The database structure includes columns for:
  - `activity_type`: Type of activity (e.g., `Mouse Click`, `Key Press`, `Application`, or `Website`).
  - `detail`: Additional information (e.g., specific key pressed, window title, or URL).
  - `timestamp`: Timestamp for each logged activity.

### 4. UI

- Displays counts of mouse clicks and keypresses.
- Shows a list of recently visited applications and URLs with timestamps.
- Clear logs button allows users to delete stored activity.

### 5. Data Visualization (Optional)

Integrates Chart.js to display data visualization, such as pie charts showing activity distribution over time.

## Code Explanation

### Key Files and Code Sections

- **`activityTracker.js`**: Monitors active applications and captures mouse clicks and keyboard key presses.
  - Uses `setInterval` to check the current active window every few seconds.
  - Implements a cooldown mechanism to avoid duplicate logs for the same application.
  
- **`database.js`**: Manages SQLite database operations for saving, retrieving, and clearing activity logs.
  - `saveActivityLog()`: Adds new activity entries.
  - `getRecentActivityLogs()`: Fetches recent logs for display in the UI.
  - `clearLogs()`: Deletes all stored logs.

- **`renderer.js`**: Handles the UI logic, displaying activity data and counts.
  - Uses IPC communication with `main.js` to retrieve data from the database.
  - Updates counts and logs in the UI every few seconds.

### Permissions (macOS)

On macOS, you may need to grant permissions to the app:
- Go to **System Preferences > Security & Privacy > Privacy** and add the Electron app (or terminal running it) to **Accessibility** and **Screen Recording** to enable active window tracking.

## Troubleshooting

- **Mouse Clicks Not Captured**: Ensure `document.addEventListener('click', ...)` is implemented in `renderer.js`.
- **Database Errors**: If there are errors with SQLite, make sure SQLite is correctly installed and that the database file has appropriate read/write permissions.
- **Global Mouse Tracking**: If using `iohook` for global tracking, check compatibility with the Electron version and OS permissions (especially on macOS).

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- **Electron** for providing a powerful framework for desktop application development.
- **active-win** for enabling tracking of the current active window across platforms.
  