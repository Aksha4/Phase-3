exports.validateProduct = (req, res, next) => {
    const { name, price } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({
            message: "Product name is required."
        });
    }

    if (price === undefined || isNaN(price) || Number(price) <= 0) {
        return res.status(400).json({
            message: "Price must be a positive number."
        });
    }

    next();
};