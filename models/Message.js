const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
        text: {
            type: String,
        },
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
