const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const protect = require("../middleware/authMiddleeware");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Protected Profile
router.get("/profile", protect, (req, res) => {
    res.json({
        message: "Welcome User",
        user: req.user,
    });
});

module.exports = router;