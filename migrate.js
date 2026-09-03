const db = require("../database/database");

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

db.run(createUsersTable, (err) => {
    if (err) {
        console.error("Error creating users table:", err.message);
    } else {
        console.log("Users table created successfully.");
    }

    db.close();
});