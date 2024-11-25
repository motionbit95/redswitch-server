const express = require("express");
const admin = require("firebase-admin");
const { Category } = require("../model/Product");

const router = express.Router();

const cors = require("cors");
router.use(cors());

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: 상품 카테고리
 */

// Create a new category
/**
 * @swagger
 * /products/categories:
 *   post:
 *     summary: 새로운 카테고리를 생성합니다.
 *     description: 제공된 정보를 바탕으로 새로운 카테고리를 생성합니다.
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_category
 *               - product_category_code
 *             properties:
 *               product_category:
 *                 type: string
 *                 description: 상품 카테고리 이름
 *               product_category_code:
 *                 type: string
 *                 description: 상품 카테고리 코드
 *     responses:
 *       201:
 *         description: 카테고리 생성 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pk:
 *                   type: string
 *                   description: 카테고리 고유 ID
 *                 product_category:
 *                   type: string
 *                   description: 상품 카테고리 이름
 *                 product_category_code:
 *                   type: string
 *                   description: 상품 카테고리 코드
 *                 created_at:
 *                   type: string
 *                   description: 카테고리 생성 일시
 *       400:
 *         description: 필수 필드 누락
 *       500:
 *         description: 서버 오류
 */
router.post("/categories", async (req, res) => {
  try {
    const { product_category, product_category_code } = req.body;

    if (!product_category || !product_category_code) {
      return res
        .status(400)
        .json({ message: "상품 카테고리와 코드가 필요합니다." });
    }

    const category = new Category({
      product_category,
      product_category_code,
    });

    const createdCategory = await category.create();
    res.status(201).json(createdCategory);
    console.log(createdCategory);
  } catch (error) {
    console.error("카테고리 생성 오류:", error);
    res
      .status(500)
      .json({ message: "카테고리 생성 실패", error: error.message });
  }
});

// Get all categories
/**
 * @swagger
 * /products/categories:
 *   get:
 *     summary: 모든 카테고리 정보를 조회합니다.
 *     description: 저장된 모든 카테고리 정보를 조회합니다.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: 카테고리 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pk:
 *                     type: string
 *                     description: 카테고리 고유 ID
 *                   product_category:
 *                     type: string
 *                     description: 상품 카테고리 이름
 *                   product_category_code:
 *                     type: string
 *                     description: 상품 카테고리 코드
 *                   created_at:
 *                     type: string
 *                     description: 카테고리 생성 일시
 *       500:
 *         description: 서버 오류
 */
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("카테고리 목록 조회 오류:", error);
    res
      .status(500)
      .json({ message: "카테고리 목록 조회 실패", error: error.message });
  }
});

// Get a category by PK
/**
 * @swagger
 * /products/categories/{pk}:
 *   get:
 *     summary: 카테고리 정보를 조회합니다.
 *     description: 주어진 PK로 카테고리 정보를 조회합니다.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 카테고리 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 카테고리 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pk:
 *                   type: string
 *                   description: 카테고리 고유 ID
 *                 product_category:
 *                   type: string
 *                   description: 상품 카테고리 이름
 *                 product_category_code:
 *                   type: string
 *                   description: 상품 카테고리 코드
 *                 created_at:
 *                   type: string
 *                   description: 카테고리 생성 일시
 *       404:
 *         description: 카테고리를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/categories/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const category = await Category.getByPk(pk);
    res.status(200).json(category);
  } catch (error) {
    console.error("카테고리 조회 오류:", error);
    res
      .status(500)
      .json({ message: "카테고리 조회 실패", error: error.message });
  }
});

// Update a category by PK
/**
 * @swagger
 * /products/categories/{pk}:
 *   put:
 *     summary: 카테고리 정보를 수정합니다.
 *     description: 주어진 PK로 카테고리 정보를 수정합니다.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 카테고리 고유 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_category:
 *                 type: string
 *                 description: 상품 카테고리 이름
 *               product_category_code:
 *                 type: string
 *                 description: 상품 카테고리 코드
 *     responses:
 *       200:
 *         description: 카테고리 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pk:
 *                   type: string
 *                   description: 카테고리 고유 ID
 *                 product_category:
 *                   type: string
 *                   description: 상품 카테고리 이름
 *                 product_category_code:
 *                   type: string
 *                   description: 상품 카테고리 코드
 *                 created_at:
 *                   type: string
 *                   description: 카테고리 생성 일시
 *                 updated_at:
 *                   type: string
 *                   description: 카테고리 수정 일시
 *       400:
 *         description: 필수 필드 누락
 *       404:
 *         description: 카테고리 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/categories/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const { product_category, product_category_code } = req.body;

    if (!product_category && !product_category_code) {
      return res.status(400).json({ message: "수정할 필드를 제공해 주세요." });
    }

    const category = new Category({
      pk,
      product_category,
      product_category_code,
    });

    await category.update();
    res.status(200).json(category);
  } catch (error) {
    console.error("카테고리 수정 오류:", error);
    res
      .status(500)
      .json({ message: "카테고리 수정 실패", error: error.message });
  }
});

// Delete a category by PK
/**
 * @swagger
 * /products/categories/{pk}:
 *   delete:
 *     summary: 카테고리를 삭제합니다.
 *     description: 주어진 PK로 카테고리를 삭제합니다.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 카테고리 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 카테고리 삭제 성공
 *       404:
 *         description: 카테고리를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/categories/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    await Category.deleteByPk(pk);
    res.status(200).json({ message: "카테고리 삭제 성공" });
  } catch (error) {
    console.error("카테고리 삭제 오류:", error);
    res
      .status(500)
      .json({ message: "카테고리 삭제 실패", error: error.message });
  }
});

module.exports = router;
