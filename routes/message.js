const router = require("express").Router();
const MessageController = require("../controllers/message");

router.post("/", MessageController.createMessage);

router.get("/:conversationId", MessageController.getMessageInConversation);

router.delete('/', MessageController.deleteMessage)
module.exports = router;
