const router = require("express").Router();
const ConversationController = require("../controllers/conversation");

router.get("/", ConversationController.getAll);

router.get("/room", ConversationController.getAllRooms);

router.get("/:userID", ConversationController.getConversationOfUser);

router.get(
    "/find/:firstUserId/:secondUserId",
    ConversationController.getConversationIncludesTwoUser
);

router.post("/create-conversation", ConversationController.create);

router.post("/room", ConversationController.createRoom);

router.delete("/", ConversationController.delete);

module.exports = router;
