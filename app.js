//app.js
const express = require("express");
const cors = require("cors");

const app = express();
const port = 8080;

// Firebase Admin SDK
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://redswitch-64c62-default-rtdb.firebaseio.com",
});

// Realtime Database 참조
const db = admin.database();

// 데이터 삽입 함수
async function insertData() {
  const ref = db.ref("users"); // "users" 테이블(참조) 생성
  const newUserRef = ref.push(); // 고유 키로 새 데이터 생성
  await newUserRef.set({
    name: "John Doe",
    email: "johndoe@example.com",
    age: 30,
  });

  console.log("Data inserted successfully!");
}

// 실행
insertData().catch(console.error);

// 모든요청에 cors 적용
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
