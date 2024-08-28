import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false, 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Items = mongoose.model("Items", itemSchema);
export default Items;
