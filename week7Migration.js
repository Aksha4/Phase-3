const db = require("../database/database");

const addUserIdColumn = `
ALTER TABLE products
ADD COLUMN user_id INTEGER;
`;

db.run(addUserIdColumn, (err) => {
    if (err) {
        if (err.message.includes("duplicate column name")) {
            console.log("user_id column already exists.");
        } else {
            console.error("Migration error:", err.message);
        }
    } else {
        console.log("user_id column added successfully.");
    }

    db.close();
});