const Conversation = require("../models/Conversation");
const Room = require("../models/Room");

class ConversationController {
    // [GET] /get-all
    async getAll(req, res, next) {
        const conversations = await Conversation.find();
        res.status(200).json(conversations);
    }

    // [POST] /create-conversation
    async create(req, res, next) {
        try {
            const newConversation = new Conversation({
                members: [req.body.senderID, req.body.receiverID],
            });

            const result = await newConversation.save();
            res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }

    // [GET] /:userID
    async getConversationOfUser(req, res, next) {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userID] },
        });
        res.status(200).json(conversation);
    }

    // [GET] /find/:firstUserId/:secondUserId
    async getConversationIncludesTwoUser(req, res, next) {
        const conversation = await Conversation.findOne({
            members: {
                $all: [req.params.firstUserId, req.params.secondUserId],
            },
        });
        res.status(200).json(conversation);
    }

    // [DELETE] /
    async delete(req, res, next) {
        const result = await Conversation.deleteMany({});
        res.status(200).json(result);
    }

    // [Room]
    async getAllRooms(req, res) {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    }

    async createRoom(req, res) {
        const { name } = req.body;
        const newRoom = new Room({ name });

        const result = await newRoom.save();
        res.status(200).json(result);
    }
}

module.exports = new ConversationController();
