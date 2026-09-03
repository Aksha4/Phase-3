const db = require("../database/database");

const query = `
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

db.run(query, (err) => {
    if (err) {
        console.error("Error creating products table:", err.message);
    } else {
        console.log("Products table created successfully.");
    }

    db.close();
});