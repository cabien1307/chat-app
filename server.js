require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const userRouter = require("./routes/userRouter");
const uploadRouter = require("./routes/upload");
const messageRouter = require("./routes/message");
const conversationRouter = require("./routes/conversation");

const app = express();

// Socket.io config
const server = require('http').Server(app)

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
    fileUpload({
        useTempFiles: true,
    })
);

//connect to mongoDB
const URI = process.env.MONGODB_URL;
const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Connected to mongoDB!");
    } catch (error) {
        if (error) throw error;
    }
};

connectDB();

//Routes
app.use("/api/user", userRouter);
app.use("/api", uploadRouter);
app.use("/api/message", messageRouter);
app.use("/api/conversation", conversationRouter);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log("Server is running at Port", PORT);
});
