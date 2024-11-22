const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");
const Bdsm = require("../model/bdsm");

const cors = require("cors");
router.use(cors());

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

    const answerRef = db.ref("bdsm_answers");
    const answerSnapshot = await answerRef
      .orderByChild("index")
      .limitToLast(1)
      .once("value");

    let answerIndex = 1; // 기본값 (첫 번째 데이터는 1로 시작)

    if (snapshot.exists()) {
      const lastBdsm = answerSnapshot.val();
      const lastIndex = Object.values(lastBdsm)[0].index;
      answerIndex = lastIndex + 1; // 마지막 index에 1을 더해 새로운 index 값 설정
    }

    console.log(answerIndex);

    for (let i = 0; i < 7; i++) {
      const newBdsmAnswer = new Bdsm.Answer(
        answerIndex,
        (question_pk = newIndex),
        (step = i + 1),
        (master_mistress_ = 0),
        (slave_ = 0),
        (hunter_ = 0),
        (prey_ = 0),
        (brat_tamer_ = 0),
        (brat_ = 0),
        (owner_ = 0),
        (pet_ = 0),
        (daddy_mommy_ = 0),
        (little_ = 0),
        (sadist_ = 0),
        (masochist_ = 0),
        (spanker_ = 0),
        (spankee_ = 0),
        (degrader_ = 0),
        (degradee_ = 0),
        (rigger_ = 0),
        (rope_bunny_ = 0),
        (dominant_ = 0),
        (submissive_ = 0),
        (switch_ = 0),
        (vanilla_ = 0)
      );

      console.log(newBdsmAnswer);

      await newBdsmAnswer.add();
      answerIndex++;
    }

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

/**
 * @swagger
 * /bdsm/update-question:
 *   put:
 *     tags:
 *       - BDSM
 *     summary: Update a BDSM question
 *     description: Update a BDSM question in the server.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_pk:
 *                 type: integer
 *               question:
 *                 type: string
 *     responses:
 *       200:
 *         description: BDSM question updated successfully
 *       404:
 *         description: BDSM question not found
 *       500:
 *         description: Internal server error
 * */
router.put("/update-question", async (req, res) => {
  const { question_pk = 0, question = "" } = req.body; // 클라이언트에서 보낸 요청 데이터

  try {
    // Firebase에서 question_pk에 해당하는 질문을 가져오기
    const ref = db.ref("bdsm_questions");
    const snapshot = await ref
      .orderByChild("index")
      .equalTo(question_pk) // 주어진 question_pk와 일치하는 항목을 찾습니다
      .once("value");

    if (!snapshot.exists()) {
      return res
        .status(404)
        .json({ message: "해당 질문이 존재하지 않습니다." });
    }

    // 기존 질문을 수정
    const existingBdsmQuestion = snapshot.val();
    const questionKey = Object.keys(existingBdsmQuestion)[0]; // 첫 번째 항목만 수정

    // 질문을 업데이트
    const updatedBdsmQuestion = {
      question_pk,
      question,
    };

    // Firebase에서 해당 질문을 업데이트
    await ref.child(questionKey).update(updatedBdsmQuestion);

    // 관련된 답변을 업데이트 (만약 수정이 필요하다면)
    const answerRef = db.ref("bdsm_answers");
    const answerSnapshot = await answerRef
      .orderByChild("question_pk")
      .equalTo(question_pk)
      .once("value");

    if (answerSnapshot.exists()) {
      const existingAnswers = answerSnapshot.val();
      const answerKeys = Object.keys(existingAnswers);

      // 각 답변을 업데이트 (원하는 필드만 수정)
      for (const answerKey of answerKeys) {
        const updatedAnswer = {
          ...existingAnswers[answerKey],
          question_pk,
          // 필요한 값들 수정
        };
        await answerRef.child(answerKey).update(updatedAnswer);
      }
    }

    res.status(200).json({ message: "BDSM 질문이 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("BDSM 질문 수정 오류 : ", error);
    res.status(500).json({ message: "BDSM 질문 수정 중 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /bdsm/update-answer:
 *   put:
 *     tags:
 *       - BDSM
 *     summary: Update an answer
 *     description: Update an answer in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               index:
 *                 type: integer
 *               question_pk:
 *                 type: integer
 *               step:
 *                 type: integer
 *               master_mistress_:
 *                 type: integer
 *               slave_:
 *                 type: integer
 *               # Add more properties as needed based on your data structure
 *     responses:
 *       200:
 *         description: Answer updated successfully
 *       500:
 *         description: Internal server error
 */
router.put("/update-answer", async (req, res) => {
  const {
    index,
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
    vanilla_,
  } = req.body;

  try {
    const answer = new Bdsm.Answer(
      index,
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

    console.log(answer);

    await answer.update();

    res
      .status(200)
      .json({ message: "BDSM 데이터가 성공적으로 업데이트되었습니다." });
  } catch (error) {
    console.error("BDSM 데이터 수정 오류: ", error);
    res
      .status(500)
      .json({ message: "BDSM 데이터를 수정하는 동안 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /bdsm/result-update/{key}:
 *   put:
 *     tags:
 *       - BDSM
 *     summary: Update a result
 *     description: Update a result in the database.
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The key of the result to update.
 *     responses:
 *       200:
 *         description: Result updated successfully
 *       500:
 *         description: Internal server error
 * */
router.put("/result-update/:key", async (req, res) => {
  const { key } = req.params;
  const { description, tendency } = req.body;

  try {
    const resultObj = new Bdsm.Result(key, tendency, description);
    await resultObj.update();
    res
      .status(200)
      .json({ message: "BDSM 데이터가 성공적으로 업데이트되었습니다." });
  } catch (error) {
    console.error("BDSM 데이터 업데이트 오류: ", error);
    res.status(500).json({
      message: "BDSM 데이터를 업데이트하는 동안 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /bdsm/list-all-results:
 *   get:
 *     tags:
 *       - BDSM
 *     summary: List all BDSM results
 *     description: Retrieve a list of all BDSM results.
 *     responses:
 *       200:
 *         description: A list of BDSM results.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   key:
 *                     type: string
 *                     example: "1"
 *                   result:
 *                     type: string
 *                     example: "1"
 *                   description:
 *                     type: string
 *                     example: "1"
 *       404:
 *         description: No BDSM results found.
 *       500:
 *         description: Internal server error
 * */
router.get("/list-all-results", async (req, res) => {
  try {
    // Reference to the "bdsm_results" node
    const ref = db.ref("bdsm_results");

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

// 점수 합산 엔드포인트
router.post("/calculate-scores", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || typeof answers !== "object") {
      return res
        .status(400)
        .json({ error: "유효한 answers 객체를 제공해주세요." });
    }

    // Firebase에서 데이터를 가져옴
    const ref = admin.database().ref("bdsm_answers");
    const snapshot = await ref.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "BDSM 답변 데이터가 없습니다." });
    }

    const allAnswers = snapshot.val(); // Firebase에서 가져온 모든 답변 데이터
    const scores = {
      master_mistress_total: 0,
      slave_total: 0,
      hunter_total: 0,
      prey_total: 0,
      brat_tamer_total: 0,
      brat_total: 0,
      owner_total: 0,
      pet_total: 0,
      daddy_mommy_total: 0,
      little_total: 0,
      sadist_total: 0,
      masochist_total: 0,
      spanker_total: 0,
      spankee_total: 0,
      degrader_total: 0,
      degradee_total: 0,
      rigger_total: 0,
      rope_bunny_total: 0,
      dominant_total: 0,
      submissive_total: 0,
      switch_total: 0,
      vanilla_total: 0,
    };

    // 요청된 answers 데이터 기반으로 점수 합산
    for (const [question_pk, step] of Object.entries(answers)) {
      // 해당 question_pk에 해당하는 Answer 데이터를 찾음
      const answerData = Object.values(allAnswers).find(
        (answer) => answer.question_pk === parseInt(question_pk)
      );

      if (answerData) {
        // 각 항목별 점수를 누적
        scores.master_mistress_total += answerData.master_mistress_ || 0;
        scores.slave_total += answerData.slave_ || 0;
        scores.hunter_total += answerData.hunter_ || 0;
        scores.prey_total += answerData.prey_ || 0;
        scores.brat_tamer_total += answerData.brat_tamer_ || 0;
        scores.brat_total += answerData.brat_ || 0;
        scores.owner_total += answerData.owner_ || 0;
        scores.pet_total += answerData.pet_ || 0;
        scores.daddy_mommy_total += answerData.daddy_mommy_ || 0;
        scores.little_total += answerData.little_ || 0;
        scores.sadist_total += answerData.sadist_ || 0;
        scores.masochist_total += answerData.masochist_ || 0;
        scores.spanker_total += answerData.spanker_ || 0;
        scores.spankee_total += answerData.spankee_ || 0;
        scores.degrader_total += answerData.degrader_ || 0;
        scores.degradee_total += answerData.degradee_ || 0;
        scores.rigger_total += answerData.rigger_ || 0;
        scores.rope_bunny_total += answerData.rope_bunny_ || 0;
        scores.dominant_total += answerData.dominant_ || 0;
        scores.submissive_total += answerData.submissive_ || 0;
        scores.switch_total += answerData.switch_ || 0;
        scores.vanilla_total += answerData.vanilla_ || 0;
      }
    }

    // 결과 반환
    res.json({
      success: true,
      totalScores: scores,
    });
  } catch (error) {
    console.error("점수 계산 오류:", error);
    res.status(500).json({ error: "점수 계산 중 오류가 발생했습니다." });
  }
});

// 엔드포인트 정의
router.post("/save-score-result", async (req, res) => {
  try {
    const body = req.body;

    // 요청 데이터 유효성 검사
    if (!body.age || !body.gender || body.isAgree === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "필수 데이터가 누락되었습니다." });
    }

    // Firebase 참조 생성
    const ref = db.ref("bdsm_scores");
    const newResultRef = ref.push(); // 고유 키 생성

    // 고유 id 추가
    const id = newResultRef.key;

    // Score 객체 생성
    const score = new Bdsm.Score({
      id,
      ...body, // 요청 데이터 병합
    });

    // 데이터 저장
    await newResultRef.set(score);

    console.log("데이터 저장 완료:", score);
    res.status(200).json({
      success: true,
      message: "점수 데이터가 성공적으로 저장되었습니다.",
      id,
    });
  } catch (error) {
    console.error("데이터 저장 실패:", error.message);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
