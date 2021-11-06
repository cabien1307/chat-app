import { useState, useRef, useEffect } from "react";
import { format } from "timeago.js"
import { useSelector } from 'react-redux'
import "./chat.css";

function Chat({ currentChat, messages, sendMsg, isOnline }) {
    const { user } = useSelector((state) => state.auth);
    const [newMessage, setNewMessage] = useState('')
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleSubmit = (e) => {
        e.preventDefault()
        sendMsg(newMessage)
        setNewMessage('')
    }

    return (
        <>
            {/* User info */}
            <div className="info w-full flex items-center space-x-3 py-3 border-b-2">
                <div className="avt w-12 h-12 relative">
                    <img
                        className="w-full h-auto rounded-full"
                        src={currentChat.avatar ? currentChat.avatar : "https://icon-library.com/images/groups-icon-png/groups-icon-png-4.jpg"}
                        alt={currentChat.name}
                    />
                    {
                        isOnline ? (<div className="active"></div>) : false
                    }

                </div>


                <div>
                    <h1 className="text-heading text-base font-semibold">
                        {currentChat.name}
                    </h1>
                    {
                        isOnline
                            ? (<p className="text-xs italic">Active now</p>)
                            : false
                    }

                </div>
            </div>

            {/* Content chat */}
            <div className="chat-content mb-2" id="chat-content">
                {
                    messages && messages.length > 0
                        ? messages.map((message, index) => (
                            <div ref={scrollRef} key={index} className={message.sender._id === user._id ? "message own" : "message"}>
                                <div className="flex">
                                    <img
                                        className="h-10 w-10 rounded-full"
                                        src={message.sender.avatar}
                                        alt="avt friends"
                                    />
                                    <p className="msg bg-gray-200 px-5 py-2 ml-2 mt-2 rounded-tr-3xl rounded-b-3xl rounded-bl-3xl rounded-br-3xl rounded-tl-sm break-words">
                                        {message.text}
                                    </p>
                                </div>
                                <div className="text-sm italic ml-16">
                                    {format(message.createdAt)}
                                </div>
                            </div>
                        ))
                        : (
                            <h1 className="text-center text-2xl mt-4 text-gray-600">You are already friends ! Say something to your friend !</h1>
                        )
                }
            </div>

            {/* Send msg */}
            <form className="w-full flex space-x-3 text-2xl mt-5 border-t-2 py-5">

                {/* Attach file */}
                <div className="w-1/5 icon flex items-center justify-around">
                    <label htmlFor="file">
                        <i className="far fa-images cursor-pointer "></i>
                    </label>
                    <label htmlFor="image">
                        <i className="fas fa-paperclip cursor-pointer "></i>
                    </label>
                    <input type="file" id="image" className="hidden" />
                    <input type="file" id="file" className="hidden" />
                </div>

                {/* Content */}
                <div className="w-3/5 content-msg flex items-center">
                    <input
                        type="text"
                        name=""
                        id=""
                        placeholder="Aa"
                        className="w-full outline-none bg-gray-200 px-3 py-2 rounded-3xl text-base"
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                    />
                </div>

                {/* Send */}
                <div className="w-1/5 send flex items-center justify-center">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-btn-bg text-btn-text w-20 py-1 px-3 rounded-md hover:bg-yellow-700"
                    >
                        <i className="fas fa-paper-plane w-full"></i>
                    </button>
                </div>
            </form>
        </>
    );
}

export default Chat;
