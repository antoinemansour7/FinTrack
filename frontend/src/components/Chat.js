import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styling/Chat.css";

const Chat = () => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi! How can I help you today?" },
    ]);
    const [userInput, setUserInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!userInput.trim()) return;

        const newMessages = [...messages, { sender: "user", text: userInput }];
        setMessages(newMessages);
        setUserInput("");

        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.post("http://localhost:3000/api/chat/chat", {
                message: userInput,
                userId // Will be undefined if user is not logged in
            });

            const botResponse = response.data.reply;
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: botResponse },
            ]);
        } catch (error) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { 
                    sender: "bot", 
                    text: "Sorry, I encountered an error. Please try again later." 
                },
            ]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                FinTrack Assistant
            </div>
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
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="chat-input"
                />
                <button 
                    onClick={handleSend} 
                    className="chat-send-button"
                    aria-label="Send message"
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default Chat;