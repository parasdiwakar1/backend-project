import { Router } from "express";
import Items from "./itemschima.js";
import User from "./userschima.js";
import jwt from 'jsonwebtoken';

const itemroute = Router();
const JWT_SECRET = "paras@123";

itemroute.post("/create", async (req, res) => {
    const { name } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).send("User is not logged in");
    }

    if (!name) {
        return res.status(400).send("Enter item name");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userID);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const item = new Items({ name, user: user._id });
        const saveItem = await item.save();

        user.Items.push(saveItem._id); 
        await user.save();

        res.status(201).send(saveItem);
    } catch (err) {
        res.status(500).json({ message: "Error creating item", error: err.message });
    }
});

export default itemroute;
