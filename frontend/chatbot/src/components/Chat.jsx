import React from "react";
import "../css/chat.css";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import aiBotImage from "../assets/ai-bot.jpeg";

// Import the ReactMarkdown component to handle markdown rendering
import ReactMarkdown from "react-markdown";
const Chat = () => {
  const [message, setMessage] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [conversations, setConversations] = React.useState([
    {
      role: "assistant",
      content:
        "Hello! I'm ready to go. I'm here to help with whatever you need.",
    },
  ]);

  const sendMessage = async (messageContent) => {
    // This is a placeholder for a real API call.
    // Replace with your actual chatbot logic.
    const res = await axios.post("https://educational-bot-qk97.onrender.com", {
      message: messageContent,
    });
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: sendMessage,
    mutationKey: ["ChatBot"],
    onSuccess: (data) => {
      setIsTyping(false);
      setConversations((prevConversation) => [
        ...prevConversation,
        { role: "assistant", content: data.message },
      ]);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentMessage = message.trim();
    if (!currentMessage) {
      alert("Please enter a message");
      return;
    }

    setConversations((prevConversation) => [
      ...prevConversation,
      { role: "user", content: currentMessage },
    ]);

    setIsTyping(true);
    mutation.mutate(currentMessage);
    setMessage("");
  };

  return (
    <div className="chat-container">
      {/* Profile Sidebar */}
      <div className="profile-sidebar">
        {/* All content is now a direct child of the sidebar */}
        <div className="avatar-container">
          <img src={aiBotImage} alt="Sarah's Avatar" />
        </div>
        <div className="nameBot">
          <b>Educational Bot</b>
        </div>
        <div className="profile-message">
          <b>I'm ready to help you make it clearer</b>
        </div>
        <div className="about">
          "I'm here to help with any information or support you need. Just ask!"
        </div>
        {/* You can add more profile info or links here if needed */}
      </div>

      {/* Main Chat Area */}
      <div className="main-chat-area">
        <div className="header">
          <h1 className="title">AI ChatBot</h1>
          <p className="description">
            Enter your message below and get a response from the AI chatbot.
          </p>
        </div>

        <div className="conversation">
          {conversations.map((entry, index) => (
            <div className={`message ${entry.role}`} key={index}>
              {/* Conditional rendering to apply markdown only to assistant messages */}
              {entry.role === "assistant" ? (
                <ReactMarkdown>{entry.content}</ReactMarkdown>
              ) : (
                entry.content
              )}
            </div>
          ))}
          {isTyping && <div className="typing-indicator">AI is Typing...</div>}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
          />
          <button onClick={handleSubmit}>
            {mutation?.isPending ? "loading" : "send message"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
