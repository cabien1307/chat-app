const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
    {
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "Users",
            },
        ],
    },
    { timestamps: true }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
