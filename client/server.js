import express from "express";
import path from "path";

const app = express();

app.use(express.static("dist"));

// FIXED ROUTE FOR EXPRESS 5
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});