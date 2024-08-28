import express from 'express';
import mongoose from 'mongoose';
import itemroute from './itemroute.js';
import userroute from './userroute.js';

const port = 3000;
const app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/datauser")
    .then(() => {
        console.log("MongoDB is connected");
    })
    .catch((err) => {
        console.error("MongoDB connection failed", err);
    });


app.use("/data", itemroute); 
app.use("/data", userroute); 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
