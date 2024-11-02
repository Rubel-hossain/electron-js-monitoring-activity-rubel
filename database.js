const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, 'activity_logs.db'), (err) => {
            if (err) console.error('Database error:', err.message);
            this.initializeDatabase();
        });
    }

    initializeDatabase() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                activity_type TEXT,
                detail TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    saveActivityLog(activityType, detail) {
        this.db.run(
            `INSERT INTO logs (activity_type, detail) VALUES (?, ?)`,
            [activityType, detail],
            (err) => {
                if (err) console.error('Failed to insert log:', err.message);
                else console.log('Log saved');
            }
        );
    }

    getRecentActivityLogs() {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100`,
                (err, rows) => {
                    if (err) {
                        console.error('Failed to retrieve data:', err.message);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    }

    clearLogs() {
        console.log('Clearing all logs...');
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM logs', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = Database;
