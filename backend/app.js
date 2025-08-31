import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
import { GoogleGenerativeAI } from "@google/generative-ai";
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
};
app.use(cors(corsOptions));
// Initialize the chat session with the correct history format
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "You are a helpful assistant." }],
    },
    {
      role: "model",
      parts: [{ text: "Hello! How can I assist you today?" }],
    },
  ],
});

app.post("/", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const text = response.text();
    res.json({ message: text });
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    res.status(500).json({ error: "An error occurred with the AI service." });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
