const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateName, validateEmail, validatePassword } = require("../utils/validators");

// signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, isSeller } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(403).json({ err: "User already exists" });
        }
        if (!validateName(name)) {
            return res.status(400).json({ err: "Name Validate fails" })
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ err: "Email Validate fails" })
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ err: "Password Validate fails" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = { name, email, hashedPassword, isSeller }

        const createdUser = await User.create(user);
        return res.status(201).json({ message: `welcome ${createdUser.name}` })

    }
    catch (err) {
        return res.status(500).send(err);
    }
});

// signin
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email.length === 0) {
            return res.status(400).json({ err: "please provide an email" })
        }

        if (password.length === 0) {
            return res.status(400).json({ err: "please provide a password" })
        }

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(404).json({ err: "User not found" })
        }

        const passwordMatched = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatched) {
            return res.status(400).json({ err: "email or password mismatch" })
        }

        const secretKey = process.env.SECRET_KEY;

        const payload = { user: { id: existingUser.id } };
        const bearerToken = await jwt.sign(payload, secretKey, { expiresIn: 360000 });

        res.cookie("t", bearerToken, { expiresIn: new Date() + 9999 });
        return res.status(200).json({ bearerToken })


    }
    catch (err) {
        console.log("qqqqqqq", err)
        return res.status(500).send(err);
    }
})

// signout
router.get("/signout", (req, res) => {
    try {
        res.clearCookie("t");
        return res.status(200).json({ message: "cookie deleted" })
    }
    catch (err) {
        return res.status(500).send(err);
    }
})

module.exports = router;