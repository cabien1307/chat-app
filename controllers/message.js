const Message = require('../models/Message')
class MessageController {

    // [POST] /
    async createMessage(req, res, next) {
        const newMessage = new Message(req.body);
        await newMessage.save()
        const result = await Message.find({
            conversationId: newMessage.conversationId,
        }).populate('sender')
        res.status(200).json(result)
    }

    // [GET] /
    async getMessageInConversation(req, res, next) {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        }).populate('sender')
        res.status(200).json(messages);
    }

    // [DELETE] /
    async deleteMessage(req, res, next) {
        const result = await Message.deleteMany({});
        res.status(200).json(result)
    }
}

module.exports = new MessageController