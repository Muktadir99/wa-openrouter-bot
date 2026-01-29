const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const data = req.body;

  if (!data.query || !data.query.message) {
    return res.json({
      replies: [{ message: "Invalid message" }]
    });
  }

  const message = data.query.message;

  // Cost control: only trigger AI if message starts with ai
  if (!message.toLowerCase().startsWith("ai ")) {
    return res.json({
      replies: [{ message: "Type: ai <your question>" }]
    });
  }

  const userPrompt = message.replace(/^ai\s+/i, "");

  try {
    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "Reply short, clear, practical. Max 4 lines." },
          { role: "user", content: userPrompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const replyText =
      aiResponse.data.choices[0].message.content || "No response";

    res.json({
      replies: [{ message: replyText }]
    });

  } catch (err) {
    res.json({
      replies: [{ message: "AI error. Try again later." }]
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});