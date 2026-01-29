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
Reply short, casual, Bangla-English mix.
One sentence only.
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