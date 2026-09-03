const productModel = require("../models/productModel");
const { redisClient } = require("../config/redis");
// Create Product
exports.createProduct = (req, res) => {
    const { name, description, price } = req.body;
    const userId = req.user.id;

    if (!name || !price) {
        return res.status(400).json({
            message: "Name and price are required."
        });
    }

    productModel.createProduct(
        userId,
        name,
        description,
        price,
        (err, productId) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to create product.",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Product created successfully.",
                productId,
                userId
            });
        }
    );
};

// Get All Products
exports.getAllProducts = async (req, res) => {
    const cacheKey = "products:all";

    try {
        // Check Redis cache
        const cachedProducts = await redisClient.get(cacheKey);

        if (cachedProducts) {
            console.log("Products served from Redis cache.");

            return res.json({
                source: "cache",
                products: JSON.parse(cachedProducts)
            });
        }

        // Cache miss - get data from SQLite
        productModel.getAllProducts(async (err, products) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to retrieve products."
                });
            }

            try {
                // Save result in Redis for 60 seconds
                await redisClient.setEx(
                    cacheKey,
                    60,
                    JSON.stringify(products)
                );

                console.log("Products loaded from database and cached.");

                res.json({
                    source: "database",
                    products
                });
            } catch (cacheError) {
                // Redis failure should not break the API
                console.error("Redis cache error:", cacheError.message);

                res.json({
                    source: "database",
                    products
                });
            }
        });
    } catch (redisError) {
        // Redis unavailable - fall back to SQLite
        console.error("Redis unavailable:", redisError.message);

        productModel.getAllProducts((err, products) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to retrieve products."
                });
            }

            res.json({
                source: "database",
                products
            });
        });
    }
};
// Get Product by ID
exports.getProductById = (req, res) => {
    const id = req.params.id;

    productModel.getProductById(id, (err, product) => {
        if (err) {
            return res.status(500).json({
                message: "Database error."
            });
        }

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.json(product);
    });
};

// Update Product
exports.updateProduct = (req, res) => {
    const id = req.params.id;
    const { name, description, price } = req.body;

    productModel.updateProduct(id, name, description, price, (err) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to update product."
            });
        }

        res.json({
            message: "Product updated successfully."
        });
    });
};


// Search Products
exports.searchProducts = (req, res) => {
    const { name } = req.query;

    if (!name || name.trim() === "") {
        return res.status(400).json({
            message: "Search name is required."
        });
    }

    productModel.searchProducts(name, (err, products) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to search products.",
                error: err.message
            });
        }

        res.json(products);
    });
};

// Get Products with Pagination
exports.getProductsPaginated = (req, res) => {
    let { page = 1, limit = 5 } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (
        !Number.isInteger(page) ||
        !Number.isInteger(limit) ||
        page < 1 ||
        limit < 1
    ) {
        return res.status(400).json({
            message: "Page and limit must be positive integers."
        });
    }

    const offset = (page - 1) * limit;

    productModel.getProductsPaginated(
        limit,
        offset,
        (err, products) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to retrieve products.",
                    error: err.message
                });
            }

            res.json({
                page,
                limit,
                products
            });
        }
    );
};

exports.getMyProducts = (req, res) => {
    const userId = req.user.id;

    productModel.getProductsByUserId(userId, (err, products) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to retrieve your products.",
                error: err.message
            });
        }

        res.json({
            userId,
            products
        });
    });
};

// Delete Product
exports.deleteProduct = (req, res) => {
    const id = req.params.id;

    productModel.deleteProduct(id, (err) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to delete product."
            });
        }

        res.json({
            message: "Product deleted successfully."
        });
    });
};