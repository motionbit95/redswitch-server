const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");
const Bdsm = require("../model/bdsm");

// Realtime Database 참조
const db = admin.database();

/** @swagger
 * tags:
 *   name: BDSM
 *   description: BDSM
 */

/**
 * @swagger
 * /bdsm/add:
 *   post:
 *     tags:
 *       - BDSM
 *     summary: BDSM 문항 생성
 *     description: BDSM 문항를 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               master_mistress_:
 *                 type: number
 *               slave_:
 *                 type: number
 *               hunter_:
 *                 type: number
 *               prey_:
 *                 type: number
 *               brat_tamer_:
 *                 type: number
 *               brat_:
 *                 type: number
 *               owner_:
 *                 type: number
 *               pet_:
 *                 type: number
 *               daddy_mommy_:
 *                 type: number
 *               little_:
 *                 type: number
 *               sadist_:
 *                 type: number
 *               masochist_:
 *                 type: number
 *               spanker_:
 *                 type: number
 *               spankee_:
 *                 type: number
 *               degrader_:
 *                 type: number
 *               degradee_:
 *                 type: number
 *               rigger_:
 *                 type: number
 *               rope_bunny_:
 *                 type: number
 *               dominant_:
 *                 type: number
 *               submissive_:
 *                 type: number
 *               switch_:
 *                 type: number
 *               vanilla_:
 *                 type: number
 *     responses:
 *       200:
 *         description: BDSM 문항 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: BDSM 문항 생성 성공
 *       400:
 *         description: BDSM 문항 생성 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question is required
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *               error:
 *                   type: string
 *                   example: Error message
 */
router.post("/add", async (req, res) => {
  const {
    question,
    master_mistress_ = 0,
    slave_ = 0,
    hunter_ = 0,
    prey_ = 0,
    brat_tamer_ = 0,
    brat_ = 0,
    owner_ = 0,
    pet_ = 0,
    daddy_mommy_ = 0,
    little_ = 0,
    sadist_ = 0,
    masochist_ = 0,
    spanker_ = 0,
    spankee_ = 0,
    degrader_ = 0,
    degradee_ = 0,
    rigger_ = 0,
    rope_bunny_ = 0,
    dominant_ = 0,
    submissive_ = 0,
    switch_ = 0,
    vanilla_ = 0,
  } = req.body; // 클라이언트에서 보낸 요청 데이터

  // question이 없으면 에러 발생
  if (!question) {
    return res.status(400).json({ message: "Question is required" });
  }

  try {
    // Firebase에서 가장 큰 index 값 가져오기
    const ref = db.ref("bdsm");
    const snapshot = await ref
      .orderByChild("index")
      .limitToLast(1)
      .once("value");

    let newIndex = 1; // 기본값 (첫 번째 데이터는 1로 시작)

    if (snapshot.exists()) {
      const lastBdsm = snapshot.val();
      const lastIndex = Object.values(lastBdsm)[0].index;
      newIndex = lastIndex + 1; // 마지막 index에 1을 더해 새로운 index 값 설정
    }

    // Bdsm 객체 생성
    const newBdsm = new Bdsm(
      newIndex,
      question,
      master_mistress_,
      slave_,
      hunter_,
      prey_,
      brat_tamer_,
      brat_,
      owner_,
      pet_,
      daddy_mommy_,
      little_,
      sadist_,
      masochist_,
      spanker_,
      spankee_,
      degrader_,
      degradee_,
      rigger_,
      rope_bunny_,
      dominant_,
      submissive_,
      switch_,
      vanilla_
    );

    // Firebase에 추가
    await newBdsm.addBdsm();

    res.status(200).json({ message: "Bdsm data added successfully!" });
  } catch (error) {
    console.error("Error adding Bdsm data:", error);
    res.status(500).json({ message: "Error adding Bdsm data" });
  }
});

module.exports = router;
