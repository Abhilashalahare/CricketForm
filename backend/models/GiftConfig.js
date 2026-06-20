import mongoose from "mongoose";

const giftConfigSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "First 50 Gift Offer"
    },

    limit: {
        type: Number,
        default: 50
    },

    claimed: {
        type: Number,
        default: 0
    }
});

export default mongoose.model("GiftConfig", giftConfigSchema);