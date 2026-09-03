const db = require("../database/database");

exports.verifyProductOwner = (req, res, next) => {
    const productId = req.params.id;
    const userId = req.user.id;

    const sql = `
        SELECT user_id
        FROM products
        WHERE id = ?
    `;

    db.get(sql, [productId], (err, product) => {
        if (err) {
            return res.status(500).json({
                message: "Database error.",
                error: err.message
            });
        }

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        if (product.user_id !== userId) {
            return res.status(403).json({
                message: "Access denied. You do not own this product."
            });
        }

        next();
    });
};