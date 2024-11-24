const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");

const cors = require("cors");
router.use(cors());

router.post("/upload", (req, res) => {
  res.send({
    success: true,
    message: "Upload success",
    url: "testUrl",
  });
});

module.exports = router;
