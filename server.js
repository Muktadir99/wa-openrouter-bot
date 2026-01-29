const express = require("express");

const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
  console.log(req.body);

  res.json({
    replies: [
      { message: "Webhook connected successfully ✅" }
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});