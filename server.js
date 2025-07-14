import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  if (prompt.length > 300) {
    return (
      res,
      status(400).json({
        error: "Prompt is too long. Please limit the prompt to 300 characters.",
      })
    );
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 50,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const { prompt_tokens, completion_tokens, total_tokens } =
      response.data.usage;

    const reply = response.data.choices[0].message.content;
    res.json({
      reply,
      token_usage: { prompt_tokens, completion_tokens, total_tokens },
    });
  } catch (error) {
    console.error("Error communicating with OpenAI API: ", error);
    res.status(500).json({ error: "Failed to fetch response from OpenAI" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

console.log(`API Key: ${API_KEY}`);
