//app.js
const express = require("express");
const app = express();
const port = 8080;

const cors = require("cors");
// 모든요청에 cors 적용
app.use(cors());

// Firebase Admin SDK
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://redswitch-64c62-default-rtdb.firebaseio.com",
});

// swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0", // 버전 설정
  info: {
    title: "Redswitch API", // API 문서 제목
    version: "1.0.0", // API 버전
    description: "API documentation using Swagger",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // API 문서화할 파일 경로
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use(express.json());

app.use("/account", require("./routes/accountRouter"));
app.use("/bdsm", require("./routes/bdsmRouter"));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users from the server.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 */
app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
  ]);
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
// insertData().catch(console.error);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
