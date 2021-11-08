import Chat from "../../Chat/Chat";
import UserOnline from "../../UserOnline/UserOnline";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";

function Home() {
    const { user } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [userOnl, setUserOnl] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [addRoom, setAddRoom] = useState(false);
    const [isGroup, setIsGroup] = useState(false);
    const [roomName, setRoomName] = useState("");

    const socket = useRef();

    // Send message
    const handleSendMsg = async (msg) => {
        const message = {
            sender: user._id,
            conversationId: isGroup ? currentChat._id : conversation._id,
            text: msg,
        };

        try {
            const results = await axios.post("/message", message);
            // const messages = await axios.get(`/message/${conversation._id}`)
            setMessages(results.data);
            console.log("Send message");

            socket.current.emit("send-message", {
                senderId: user._id,
                receiverId: currentChat._id,
                text: msg,
            });
        } catch (error) {
            console.log(error);
        }
    };

    // Set Current Chat
    const handleClick = (u) => {
        setCurrentChat(u);
        setIsGroup(false);
    };

    // Check online user
    const checkOnl = (condition) => {
        return userOnl.some((item) => item.userId === condition);
    };

    // Connect to socket
    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("get-message", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
            console.log("get-message", data);
        });
        socket.current.on("get-rooms", (data) => {
            setRooms([...rooms, data]);
        });
    }, [rooms]);

    useEffect(() => {
        const setUpMessage = async () => {
            if (arrivalMessage && arrivalMessage.sender === currentChat?._id) {
                const result = await axios.get(`/message/${conversation?._id}`);
                console.log("Call DB after recieve msg", result.data);
                setMessages(result.data);
            }
            if (arrivalMessage && isGroup) {
                const result = await axios.get(`/message/${currentChat._id}`);
                console.log("Call DB after recieve msg", result.data);
                setMessages(result.data);
            }
        };
        setUpMessage();
    }, [arrivalMessage, conversation?._id, currentChat?._id, isGroup]);

    // Get user from socket
    useEffect(() => {
        if (user.length < 1 || !user) {
            return false;
        } else {
            socket.current.emit("add-user", user._id);
            socket.current.on("getUsers", (users) => {
                setUserOnl(users);
            });
        }
    }, [user]);

    // Get current chat and get message of current chat
    useEffect(() => {
        const getConversationIncludesTwoUser = async () => {
            if (currentChat) {
                try {
                    const res = await axios.get(
                        `/conversation/find/${currentChat._id}/${user._id}`
                    );
                    console.log(res.data);
                    setConversation(res.data);
                    // check has conversation before ---> get message
                    if (res.data) {
                        const messages = await axios.get(
                            `/message/${res.data._id}`
                        );
                        setMessages(messages.data);
                    }
                    // whether hasn't conv before ---> create new conv
                    else {
                        if (!isGroup) {
                            const data = {
                                senderID: user._id,
                                receiverID: currentChat._id,
                            };
                            await axios.post(
                                "/conversation/create-conversation",
                                data
                            );

                            setConversation(data);
                        } else {
                            const messages = await axios.get(
                                `/message/${currentChat._id}`
                            );
                            setMessages(messages.data);
                            socket.current.emit(
                                "new-user",
                                currentChat._id,
                                user.name
                            );
                            socket.current.on("user-connected", (name) => {
                                console.log(`${name} connected`);
                            });
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                return false;
            }
        };
        getConversationIncludesTwoUser();
    }, [currentChat, user, isGroup]);

    // Get All user
    useEffect(() => {
        const getAllUserInfor = async () => {
            try {
                const res = await axios.get("/user/all_infor");
                setUsers(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        const getAllRooms = async () => {
            try {
                const res = await axios.get("/conversation/room");
                setRooms(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getAllRooms();
        getAllUserInfor();
    }, []);

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/conversation/room", {
                name: roomName,
            });
            socket.current.emit("room-created", res.data);
            setRoomName("");
            setAddRoom(!addRoom);
        } catch (error) {
            console.log(error);
        }
    };

    const handleJoinRoom = (room) => {
        handleClick(room);
        setIsGroup(true);
    };

    return (
        <div className="home_page">
            <div className="2xl:container xl:container mx-auto grid grid-cols-12 gap-3 bg-background h-100">
                <div className="col-span-4 border-r-2 pr-0.5">
                    {/* Top sidebar */}
                    <div className="py-3 px-2">
                        <div className="flex items-center justify-between">
                            <h1 className="my-2 text-3xl font-semibold text-heading">
                                Socket Chat
                            </h1>
                            <i
                                className="fas fa-plus text-3xl font-semibold cursor-pointer hover:text-gray-600"
                                title="Create Group Chat"
                                onClick={() => setAddRoom(!addRoom)}
                            ></i>
                        </div>
                        {addRoom && (
                            <form onSubmit={(e) => handleCreateRoom(e)}>
                                <input
                                    type="text"
                                    className="w-10/12 px-3 py-2 my-2 outline-none bg-gray-200 rounded-3xl mr-2"
                                    placeholder="Enter room name..."
                                    onChange={(e) =>
                                        setRoomName(e.target.value)
                                    }
                                />
                                <button type="submit">Add</button>
                            </form>
                        )}
                        <div className="flex items-center space-x-3">
                            <i className="fas fa-search text-2xl font-semibold"></i>
                            <input
                                className="w-10/12 px-3 py-2 outline-none bg-gray-200 rounded-3xl"
                                type="text"
                                placeholder="Search your friends in messenger ..."
                            />
                        </div>
                    </div>

                    {/* Main side bar */}
                    <div className="main px-2">
                        {rooms.map((room) => (
                            <div
                                key={room._id}
                                className={
                                    user.isCurrent ? "user active" : "user"
                                }
                                onClick={() => handleJoinRoom(room)}
                            >
                                <UserOnline user={room} />
                            </div>
                        ))}
                        {users.map((u, index) => {
                            return u._id === user._id ? null : (
                                <div
                                    key={index}
                                    className={
                                        user.isCurrent ? "user active" : "user"
                                    }
                                    onClick={() => handleClick(u)}
                                >
                                    {u._id === user._id ? null : (
                                        <UserOnline
                                            user={u}
                                            isOnline={checkOnl(u._id)}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chat side */}
                <div className="col-span-8 border-r-2 pr-0.5">
                    {currentChat ? (
                        <Chat
                            currentChat={currentChat}
                            messages={messages}
                            sendMsg={handleSendMsg}
                            isOnline={checkOnl(currentChat._id)}
                        />
                    ) : (
                        <span className="font-semibold text-2xl">
                            Open a conversation to start a chat.
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
