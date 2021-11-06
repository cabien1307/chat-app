const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
});

var users = [];
const rooms = {};

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    //when ceonnect
    console.log(socket.id, "is connecting...");

    // Get userID and socketID
    socket.on("add-user", (userID) => {
        addUser(userID, socket.id);
        io.emit("getUsers", users);
    });

    // Listen message
    socket.on("send-message", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        if (user) {
            console.log(user.socketId);
            io.to(user.socketId).emit("get-message", {
                senderId,
                text,
            });
        } else {
            io.to(receiverId).emit("get-message", {
                senderId,
                text,
            });
        }
    });

    // Create group
    socket.on("room-created", (data) => {
        io.emit("get-rooms", data);
    });

    //Join room
    socket.on("new-user", (room, name) => {
        rooms[room] = { users: {} };
        socket.join(room);
        rooms[room].users[socket.id] = name;
        socket.to(room).emit("user-connected", name);
    });

    // Typing...
    socket.on("typing", () => {
        console.log(socket.id, "is typing...");
    });

    // Disconnect
    socket.on("disconnect", () => {
        console.log(socket.id, "is disconnected !!!");
        removeUser(socket.id);
        io.emit("getUsers", users);

        //Remove user in room
        getUserRooms(socket).forEach((room) => {
            io.to(room).emit("user-disconnected", rooms[room].users[socket.id]);
            delete rooms[room].users[socket.id];
        });
    });
});

const getUserRooms = (socket) => {
    return Object.entries(rooms).reduce((names, [name, room]) => {
        if (room.users[socket.id] != null) names.push(name);
        return names;
    }, []);
};
