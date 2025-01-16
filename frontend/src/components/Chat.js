import React, { useState } from "react";
import axios from "axios";
import "../styling/Chat.css";

const Chat = () => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi! How can I help you today?" },
    ]);
    const [userInput, setUserInput] = useState("");

    const handleSend = async () => {
        if (!userInput.trim()) return;

        const newMessages = [...messages, { sender: "user", text: userInput }];
        setMessages(newMessages);
        setUserInput("");

        try {
            const response = await axios.post("http://localhost:3000/api/chat/chat", {
                message: userInput,
            });

            const botResponse = response.data.reply;
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: botResponse },
            ]);
        } catch (error) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "Sorry, something went wrong. Please try again later." },
            ]);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${
                            msg.sender === "bot" ? "bot-message" : "user-message"
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your message here..."
                    className="chat-input"
                />
                <button onClick={handleSend} className="chat-send-button">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;