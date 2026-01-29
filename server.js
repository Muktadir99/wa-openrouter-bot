const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const data = req.body;

  // Safety check
  if (!data.query || !data.query.message) {
    return res.json({
      replies: [{ message: "Dekhlam. Ektu pore reply debo." }]
    });
  }

  const userMessage = data.query.message;

  try {
    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are Muktadir's personal agent.
Muktadir is currently busy and away from phone.
You reply on his behalf like a real human.
Never say you are an AI or bot.
Always reply in ONE short sentence.
Sound casual, polite, Bangla-English mix.
Each reply should feel slightly different.
If message is emotional or serious, say he will reply later.
`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.9
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      aiResponse.data.choices[0].message.content.trim();

    res.json({
      replies: [{ message: reply }]
    });

  } catch (err) {
    res.json({
      replies: [
        { message: "Akhon busy achi. Ektu pore reply debo." }
      ]
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});