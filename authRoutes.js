const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Protected route accessed successfully.",
        user: req.user
    });
});
module.exports = router;