//app.js
const express = require("express");
const cors = require("cors");

const app = express();
const port = 8080;

// 모든요청에 cors 적용
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
