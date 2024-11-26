const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const qs = require("querystring");

const router = express.Router();

const { JSDOM } = require("jsdom");

const cors = require("cors");
router.use(cors());

require("dotenv").config();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: 카드 결제 API
 */

/**
 * @swagger
 * /payments/request:
 *   post:
 *     summary: 카드 결제 요청
 *     description: 카드 결제 요청을 보내는 API
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               goodsNm:
 *                 type: string
 *                 description: 상품명
 *                 example: "상품명"
 *               goodsAmt:
 *                 type: number
 *                 description: 상품 가격
 *                 example: 10000
 *               ordNm:
 *                 type: string
 *                 description: 주문자명
 *                 example: "주문자명"
 *               ordTel:
 *                 type: string
 *                 description: 주문자 전화번호
 *                 example: "01012345678"
 *               ordEmail:
 *                 type: string
 *                 description: 주문자 이메일
 *                 example: "user@example.com"
 *               ordNo:
 *                 type: string
 *                 description: 주문 번호
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: 요청 성공
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       400:
 *         description: 요청 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수 파라미터가 누락되었습니다."
 */
router.post("/request", (req, res) => {
  const { goodsNm, goodsAmt, ordNm, ordTel, ordEmail, ordNo } = req.body;

  // 필수 파라미터 검증
  if (!goodsAmt || !goodsNm || !ordNm || !ordTel || !ordEmail || !ordNo) {
    return res.status(400).json({ message: "필수 파라미터가 누락되었습니다." });
  }

  // 결제 관련 데이터
  const merchantID = process.env.MERCHANT_ID;
  const ediDate = getyyyyMMddHHmmss();
  const encData = encryptData(
    `${merchantID}${ediDate}${goodsAmt}${process.env.MERCHANT_KEY}`
  );

  // HTML 템플릿 생성
  const paymentForm = `
      <html>
        <body>
          <form
            name="paymentForm"
            method="POST"
            action="https://api.payster.co.kr/payInit_hash.do"
          >
            <input type="hidden" name="payMethod" value="card" />
            <input type="hidden" name="trxCd" value="0" />
            <input type="hidden" name="mid" value="${merchantID}" />
            <input type="hidden" name="goodsNm" value="${goodsNm}" />
            <input type="hidden" name="goodsAmt" value="${goodsAmt}" />
            <input type="hidden" name="ordNm" value="${ordNm}" />
            <input type="hidden" name="ordTel" value="${ordTel}" />
            <input type="hidden" name="ordEmail" value="${ordEmail}" />
            <input type="hidden" name="ordNo" value="${ordNo}" />
            <input type="hidden" name="ediDate" value="${ediDate}" />
            <input type="hidden" name="encData" value="${encData}" />
            <input type="hidden" name="returnUrl" value="http://localhost:8080/payments/result" />
          </form>
  
          <script type="text/javascript">
            // 결제창 호출 함수
            function doPaySubmit() {
              document.paymentForm.submit();
            }
  
            window.onload = function () {
              doPaySubmit();
            };
          </script>
        </body>
      </html>
    `;

  // 클라이언트로 HTML 템플릿 반환
  res.status(200).send(paymentForm);
});

/**
 * @swagger
 * /payments/result:
 *   post:
 *     summary: 결제 결과 처리
 *     description: 결제 결과를 처리하는 API
 *     responses:
 *       200:
 *         description: 요청 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "결제 성공"
 *       400:
 *         description: 요청 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "결제 실패"
 */
router.post("/result", async (req, res) => {
  const {
    resultCode,
    resultMsg,
    tid,
    payMethod,
    ediDate,
    mid,
    goodsAmt,
    signData,
  } = req.body;

  if (resultCode !== "0000") {
    return res.status(400).json({ message: "결제 인증 실패", resultMsg });
  }

  const encData = encryptData(
    mid + ediDate + goodsAmt + process.env.MERCHANT_KEY
  );

  const requestData = new URLSearchParams({
    tid,
    mid,
    goodsAmt,
    ediDate,
    charSet: "utf-8",
    encData,
    signData,
  }).toString();

  try {
    const response = await axios.post(
      "https://api.payster.co.kr/payment.do",
      requestData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Charset: "utf-8",
        },
      }
    );

    const resultData = JSON.parse(response.data);
    res.status(200).json(resultData);
  } catch (error) {
    console.error("결제 승인 요청 실패:", error);
    res.status(500).json({ message: "결제 승인 요청 실패" });
  }
});

// Helper: 현재 날짜와 시간을 yyyyMMddHHmmss 형식으로 반환
function getyyyyMMddHHmmss() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}

// Helper: SHA-256 암호화 함수
function encryptData(data) {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

module.exports = router;
