app.post("/webhook", (req, res) => {
  console.log(req.body);

  res.json({
    replies: [
      { message: "Webhook connected successfully ✅" }
    ]
  });
});