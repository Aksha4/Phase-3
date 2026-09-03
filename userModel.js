const db = require("../database/database");

const createUser = (username, email, password, callback) => {
    const sql = `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
    `;

    db.run(sql, [username, email, password], function (err) {
        callback(err, this?.lastID);
    });
};

const findUserByEmail = (email, callback) => {
    const sql = `
        SELECT * FROM users
        WHERE email = ?
    `;

    db.get(sql, [email], callback);
};

module.exports = {
    createUser,
    findUserByEmail,
};