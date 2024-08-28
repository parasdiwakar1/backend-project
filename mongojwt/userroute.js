import { Router } from "express";
import User from "./userschima.js";
import jwt from 'jsonwebtoken';
import { hashpassword, comparePassword } from './hashpassword.js';

const userroute = Router();
const JWT_SECRET = 'paras@123';

userroute.post("/registration", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }
    try {
        const userdata = await User.findOne({ username });
        if (userdata) {
            return res.status(400).send("Username is already registered");
        }
        const hashData = await hashpassword(password);
        const user = new User({ username, password: hashData });
        await user.save();
        res.status(201).send("User registered successfully");
    } catch (err) {
        res.status(500).send("Registration failed: " + err.message);
    }
});

userroute.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }
    try {
        const userdata = await User.findOne({ username });
        if (!userdata) {
            return res.status(400).send("Username not found");
        }
        const passwordCheck = await comparePassword(password, userdata.password);
        if (!passwordCheck) {
            return res.status(400).send("Password is incorrect");
        }
        const token = jwt.sign({ userID: userdata.id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).send("Login failed: " + err.message);
    }
});

userroute.get('/status', (req, res) => {
    try {
        const authHeader = req.get('Authorization') || req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).send("Token is not found");
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send("Token is not match");
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ userID: decoded.userID });
    } catch (err) {
        res.status(401).send("Invalid token");
    }
});

export default userroute;
