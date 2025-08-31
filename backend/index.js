import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
import { GoogleGenerativeAI } from "@google/generative-ai";
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

const allowedOrigins = [
  "https://unrivaled-pavlova-694117.netlify.app",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
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
