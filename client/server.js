import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// serve static files from dist
app.use(express.static("dist"));

// handle React routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});