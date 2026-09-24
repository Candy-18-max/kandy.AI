import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "API-ключ ещё не настроен на сервере."
      });
    }

    const messages = Array.isArray(req.body.messages)
      ? req.body.messages
      : [];

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions:
        "Кэнди.AI — дружелюбный и полезный ИИ-помощник. Задай мне любой вопрос!.",
      input: messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content ?? "")
      }))
    });

    res.json({
      text: response.output_text || "Я не смогла сформировать ответ."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ошибка связи с ИИ. Проверь настройки сервера."
    });
  }
});

app.listen(port, () => {
  console.log(`Kandy.AI running on port ${port}`);
});
