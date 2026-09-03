const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    
    console.log(req.headers);
    console.log(req.body);
    
      const { username, email, password } = req.body || {};

if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        userModel.createUser(
            username,
            email,
            hashedPassword,
            (err, userId) => {
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json({
                        message: "Failed to create user.",
                        error: err.message
                    });
                }

                res.status(201).json({
                    message: "User registered successfully.",
                    userId
                });
            }
        );
    } catch (error) {
        res.status(500).json({
            message: "Server error.",
            error: error.message
        });
    }
};
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required."
        });
    }

    userModel.findUserByEmail(email, async (err, user) => {
        if (err) {
            return res.status(500).json({
                message: "Database error.",
                error: err.message
            });
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid password."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful.",
            token
        });
    });
};