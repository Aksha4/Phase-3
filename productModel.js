const db = require("../database/database");

// Create Product
const createProduct = (userId, name, description, price, callback) => {
    const sql = `
        INSERT INTO products (user_id, name, description, price)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [userId, name, description, price],
        function (err) {
            callback(err, this?.lastID);
        }
    );
};

// Get All Products
const getAllProducts = (callback) => {
    const sql = `SELECT * FROM products`;

    db.all(sql, [], callback);
};

// Get Product by ID
const getProductById = (id, callback) => {
    const sql = `SELECT * FROM products WHERE id = ?`;

    db.get(sql, [id], callback);
};

// Update Product
const updateProduct = (id, name, description, price, callback) => {
    db.serialize(() => {
        db.run("BEGIN TRANSACTION", (beginErr) => {
            if (beginErr) {
                return callback(beginErr);
            }

            const sql = `
                UPDATE products
                SET name = ?, description = ?, price = ?
                WHERE id = ?
            `;

            db.run(
                sql,
                [name, description, price, id],
                function (err) {
                    if (err) {
                        return db.run("ROLLBACK", () => {
                            callback(err);
                        });
                    }

                    db.run("COMMIT", (commitErr) => {
                        if (commitErr) {
                            return db.run("ROLLBACK", () => {
                                callback(commitErr);
                            });
                        }

                        callback(null, this.changes);
                    });
                }
            );
        });
    });
};
// Delete Product
const deleteProduct = (id, callback) => {
    const sql = `DELETE FROM products WHERE id = ?`;

    db.run(sql, [id], callback);
};

// Search Products
const searchProducts = (name, callback) => {
    const sql = `
        SELECT * FROM products
        WHERE name LIKE ?
    `;

    db.all(sql, [`%${name}%`], callback);
};
// Get Products with Pagination
const getProductsPaginated = (limit, offset, callback) => {
    const sql = `
        SELECT * FROM products
        ORDER BY id DESC
        LIMIT ? OFFSET ?
    `;

    db.all(sql, [limit, offset], callback);
};

const getProductsByUserId = (userId, callback) => {
    const sql = `
        SELECT id, user_id, name, description, price, created_at
        FROM products
        WHERE user_id = ?
        ORDER BY id DESC
    `;

    db.all(sql, [userId], callback);
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsPaginated,
    getProductsByUserId
};