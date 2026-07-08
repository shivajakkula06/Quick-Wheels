const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logActivity = require("../utils/activityLogger");

// Register
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ 
            $or: [
                { email: email.toLowerCase() },
                { name: name }
            ]
        });

        if (userExists) {
            return res.status(400).json({
                message: "User or Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: (email.toLowerCase().includes("admin") || name.toLowerCase() === "vinaykumar") ? "admin" : "user"
        });

        await logActivity({
            userId: user._id,
            username: user.name,
            email: user.email,
            action: "REGISTER",
            details: `Registered new account: ${user.name} (${user.email})`
        });

        res.status(201).json({
            message: "Registration Successful",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; // email field holds email or username from form

        let user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { name: email }
            ]
        });

        // Auto-create vinaykumar admin user if not exists on first login
        if (!user && (email === "vinaykumar" || email.toLowerCase() === "vinaykumar@admin.com")) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await User.create({
                name: "vinaykumar",
                email: "vinaykumar@admin.com",
                password: hashedPassword,
                role: "admin"
            });
            await logActivity({
                userId: user._id,
                username: user.name,
                email: user.email,
                action: "REGISTER",
                details: `Auto-registered admin account: ${user.name}`
            });
        }

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        await logActivity({
            userId: user._id,
            username: user.name,
            email: user.email,
            action: "LOGIN",
            details: `Logged into the account`
        });

        res.status(200).json({
            message: "Login Successful",
            token,
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};