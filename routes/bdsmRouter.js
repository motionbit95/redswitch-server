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
 * /bdsm/add-question:
 *   post:
 *     tags:
 *       - BDSM
 *     summary: Add a new BDSM question
 *     description: Add a new BDSM question to the server.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: The question text.
 */
router.post("/add-question", async (req, res) => {
  const { question = "" } = req.body; // 클라이언트에서 보낸 요청 데이터

  try {
    // Firebase에서 가장 큰 index 값 가져오기
    const ref = db.ref("bdsm_questions");
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
    const newBdsmQuestion = new Bdsm.Question(newIndex, question);

    // Firebase에 추가
    await newBdsmQuestion.add();

    res.status(200).json({ message: "BDSM 질문이 정상적으로 등록되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "BDSM 질문을 등록하는동안 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /bdsm/add-answer:
 *   post:
 *     tags:
 *       - BDSM
 *     summary: Add a new BDSM answer
 *     description: Add a new BDSM answer to the server.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_pk:
 *                 type: number
 *                 description: The question primary key.
 *               step:
 *                 type: number
 *                 description: The step value.
 *               master_mistress_:
 *                 type: number
 *                 description: The master_mistress_ value.
 *               slave_:
 *                 type: number
 *                 description: The slave_ value.
 *               hunter_:
 *                 type: number
 *                 description: The hunter_ value.
 *               prey_:
 *                 type: number
 *                 description: The prey_ value.
 *               brat_tamer_:
 *                 type: number
 *                 description: The brat_tamer_ value.
 *               brat_:
 *                 type: number
 *                 description: The brat_ value.
 *               owner_:
 *                 type: number
 *                 description: The owner_ value.
 *               pet_:
 *                 type: number
 *                 description: The pet_ value.
 *               daddy_mommy_:
 *                 type: number
 *                 description: The daddy_mommy_ value.
 *               little_:
 *                 type: number
 *                 description: The little_ value.
 *               sadist_:
 *                 type: number
 *                 description: The sadist_ value.
 *               masochist_:
 *                 type: number
 *                 description: The masochist_ value.
 *               spanker_:
 *                 type: number
 *                 description: The spanker_ value.
 *               spankee_:
 *                 type: number
 *                 description: The spankee_ value.
 *               degrader_:
 *                 type: number
 *                 description: The degrader_ value.
 *               degradee_:
 *                 type: number
 *                 description: The degradee_ value.
 *               rigger_:
 *                 type: number
 *                 description: The rigger_ value.
 *               rope_bunny_:
 *                 type: number
 *                 description: The rope_bunny_ value.
 *               dominant_:
 *                 type: number
 *                 description: The dominant_ value.
 *               submissive_:
 *                 type: number
 *                 description: The submissive_ value.
 *               switch_:
 *                 type: number
 *                 description: The switch_ value.
 *               vanilla_:
 *                 type: number
 *                 description: The vanilla_ value.
 */
router.post("/add-answer", async (req, res) => {
  const {
    question_pk = 0,
    step = 1,
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

  try {
    // Firebase에서 가장 큰 index 값 가져오기
    const ref = db.ref("bdsm_answers");
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
    const newBdsmAnswer = new Bdsm.Answer(
      newIndex,
      question_pk,
      step,
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
    await newBdsmAnswer.add();

    res.status(200).json({ message: "BDSM 점수가 정상적으로 추가되었습니다." });
  } catch (error) {
    console.error("BDSM 데이터 삽입 오류 : ", error);
    res
      .status(500)
      .json({ message: "BDSM 데이터 삽입을 하는동안 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /bdsm/list-all-questions:
 *   get:
 *     tags:
 *       - BDSM
 *     summary: List all BDSM questions
 *     description: Retrieve a list of all BDSM questions.
 */
router.get("/list-all-questions", async (req, res) => {
  try {
    // Reference to the "bdsm_questions" node
    const ref = db.ref("bdsm_questions");

    // Fetch all questions
    const snapshot = await ref.once("value");

    // Check if the snapshot contains any data
    if (!snapshot.exists()) {
      return res.status(404).json({ message: "No questions found." });
    }

    // Convert the data into an array (using Object.values to extract the values)
    const bdsmQuestions = Object.values(snapshot.val());

    // Return the list of questions
    res.status(200).json(bdsmQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching BDSM questions." });
  }
});

/**
 * @swagger
 * /bdsm/get-answers/{question_pk}:
 *   get:
 *     tags:
 *       - BDSM
 *     summary: Get answers for a specific BDSM question
 *     description: Retrieve a list of answers for a specific BDSM question.
 *     parameters:
 *       - in: path
 *         name: question_pk
 *         required: true
 *         description: The primary key of the BDSM question.
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: List of answers for the question
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   index:
 *                     type: integer
 *                   question_pk:
 *                     type: integer
 *                   step:
 *                     type: integer
 *                   master_mistress_:
 *                     type: integer
 *                   slave_:
 *                     type: integer
 *                   # Add more properties as needed based on your data structure
 *       404:
 *         description: No answers found for the given question
 *       500:
 *         description: Internal server error
 */
router.get("/get-answers/:question_pk", async (req, res) => {
  const { question_pk } = req.params; // Get question_pk from the URL parameter

  try {
    // Reference to the "bdsm_answers" node
    const ref = db.ref("bdsm_answers");

    // Query Firebase to filter answers by `question_pk`
    const snapshot = await ref
      .orderByChild("question_pk")
      .equalTo(Number(question_pk))
      .once("value");

    // Check if the snapshot contains any data
    if (!snapshot.exists()) {
      return res.status(404).json({
        message: "해당 질문에 대한 점수 데이터가 존재하지 않습니다.",
      });
    }

    // Convert the data into an array (using Object.values to extract the values)
    const bdsmAnswers = Object.values(snapshot.val());

    // Return the list of answers
    res.status(200).json(bdsmAnswers);
  } catch (error) {
    console.error(
      "BDSM 점수 데이터를 가져오는동안 오류가 발생했습니다 : ",
      error
    );
    res.status(500).json({
      message: "BDSM 점수 데이터를 가져오는동안 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
