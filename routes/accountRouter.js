const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const db = admin.database(); // Realtime Database 사용
const app = express();
app.use(bodyParser.json());

// JWT 비밀키 (보안을 위해 환경 변수로 관리하는 것이 좋습니다)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // 실제 환경에서는 더 안전한 키를 사용해야 합니다.

// Realtime Database에서 "accounts" 경로 사용
const accountsRef = db.ref("accounts"); // "accounts" 경로에 저장된 데이터를 가져옵니다.

// Get all accounts (GET)
/** @swagger
 * /accounts:
 *   get:
 *     tags:
 *       - Account
 *     summary: Get all accounts
 *     description: Retrieve a list of all accounts.
 *     responses:
 *       200:
 *         description: A list of accounts
 *       500:
 *         description: Internal server error
 * */
router.get("/", async (req, res) => {
  try {
    const snapshot = await accountsRef.once("value"); // Realtime Database에서 모든 데이터 읽기
    const accounts = [];
    snapshot.forEach((childSnapshot) => {
      accounts.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
    res.status(200).send(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).send({ error: "Failed to fetch accounts" });
  }
});

// Get a specific account by ID (GET)
/** @swagger
 * /accounts/{id}:
 *   get:
 *     tags:
 *       - Account
 *     summary: Get a specific account by ID
 *     description: Retrieve a specific account by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the account to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The account object
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 * */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const snapshot = await accountsRef.child(id).once("value"); // 특정 아이디로 데이터 조회
    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Account not found" });
    }
    res.status(200).send({ id: snapshot.key, ...snapshot.val() });
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).send({ error: "Failed to fetch account" });
  }
});

// Update a specific account by ID (PUT)
/** @swagger
 * /accounts/{id}:
 *   put:
 *     tags:
 *       - Account
 *     summary: Update a specific account by ID
 *     description: Update a specific account by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the account to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: The name of the user
 *     responses:
 *       200:
 *         description: Account updated successfully
 *       500:
 *         description: Internal server error
 * */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    updatedData.updated_at = new Date().toISOString(); // 타임스탬프 업데이트
    await accountsRef.child(id).update(updatedData); // 특정 계정 정보 업데이트
    res.status(200).send({ message: "Account updated successfully" });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).send({ error: "Failed to update account" });
  }
});

// Delete a specific account by ID (DELETE)
/** @swagger
 * /accounts/{id}:
 *   delete:
 *     tags:
 *       - Account
 *     summary: Delete a specific account by ID
 *     description: Delete a specific account by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the account to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       500:
 *         description: Internal server error
 * */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await accountsRef.child(id).remove(); // 특정 계정 삭제
    res.status(200).send({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).send({ error: "Failed to delete account" });
  }
});

// Login (POST)
/** @swagger
 * /accounts/login:
 *   post:
 *     tags:
 *       - Account
 *     summary: Login
 *     description: Log in a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               user_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 * */
router.post("/login", async (req, res) => {
  try {
    const { user_id, user_password } = req.body;

    // Realtime Database에서 user_id로 사용자 검색
    const snapshot = await accountsRef
      .orderByChild("user_id")
      .equalTo(user_id)
      .once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "User not found" });
    }

    const user = snapshot.val();
    const userKey = Object.keys(user)[0]; // 첫 번째 계정 키
    const storedHash = user[userKey].user_password;

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(user_password, storedHash);
    if (!isMatch) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    // JWT 토큰 발급 (사용자 정보는 적당히 커스터마이징 가능)
    const token = jwt.sign(
      { user_id: user[userKey].user_id, user_name: user[userKey].user_name }, // payload
      JWT_SECRET, // 비밀키
      { expiresIn: "1h" } // 만료 시간 (1시간)
    );

    // 비밀번호가 맞으면 로그인 성공과 함께 토큰을 반환
    res.status(200).send({
      message: "Login successful",
      token, // 발급된 JWT 토큰
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ error: "Failed to log in" });
  }
});

module.exports = router;
