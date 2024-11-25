const express = require("express");
const admin = require("firebase-admin");
const { Category, Material, Product } = require("../model/Product");

const router = express.Router();

const cors = require("cors");
router.use(cors());

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: 상품 카테고리 CRUD API
 */

/**
 * @swagger
 * tags:
 *   name: Materials
 *   description: 물자 CRUD API
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: 판매상품 CRUD API
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

// Create a new material
/**
 * @swagger
 * /products/materials:
 *   post:
 *     summary: 새로운 물자를 생성합니다.
 *     description: 제공된 정보를 바탕으로 새로운 물자를 생성합니다.
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_name
 *               - product_sale
 *               - provider_name
 *               - provider_code
 *               - product_category_code
 *             properties:
 *               product_code:
 *                 type: string
 *                 description: 상품 코드
 *               product_name:
 *                 type: string
 *                 description: 제품명
 *               product_sale:
 *                 type: string
 *                 description: 원가
 *               provider_name:
 *                 type: string
 *                 description: 거래처명
 *               original_image:
 *                 type: string
 *                 description: 제품 이미지
 *               provider_code:
 *                 type: string
 *                 description: 거래처 PK
 *               product_category_code:
 *                 type: string
 *                 description: 카테고리 PK
 *     responses:
 *       201:
 *         description: 물자 생성 성공
 *       400:
 *         description: 필수 필드 누락
 *       500:
 *         description: 서버 오류
 */
router.post("/materials", async (req, res) => {
  try {
    const {
      product_name,
      product_sale,
      provider_name,
      provider_code,
      product_category_code,
    } = req.body;

    if (
      !product_name ||
      !product_sale ||
      !provider_name ||
      !provider_code ||
      !product_category_code
    ) {
      return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
    }

    const material = new Material(req.body);

    const createdMaterial = await material.create();
    res.status(201).json(createdMaterial);
  } catch (error) {
    console.error("물자 생성 오류:", error);
    res.status(500).json({ message: "물자 생성 실패", error: error.message });
  }
});

// Get a material by PK
/**
 * @swagger
 * /products/materials/{pk}:
 *   get:
 *     summary: 물자 정보를 조회합니다.
 *     description: 주어진 PK로 물자 정보를 조회합니다.
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 물자 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 물자 조회 성공
 *       404:
 *         description: 물자를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/materials/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const material = await Material.getByPk(pk);
    res.status(200).json(material);
  } catch (error) {
    console.error("물자 조회 오류:", error);
    res.status(500).json({ message: "물자 조회 실패", error: error.message });
  }
});

// Get all materials
/**
 * @swagger
 * /products/materials:
 *   get:
 *     summary: 모든 물자 정보를 조회합니다.
 *     description: 모든 물자 정보를 조회하여 반환합니다.
 *     tags: [Materials]
 *     responses:
 *       200:
 *         description: 물자 리스트 조회 성공
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 pk:
 *                   type: string
 *                   description: 물자 고유 ID
 *                 product_code:
 *                   type: string
 *                   description: 상품 코드
 *                 product_name:
 *                   type: string
 *                   description: 제품명
 *                 product_sale:
 *                   type: string
 *                   description: 원가
 *                 provider_name:
 *                   type: string
 *                   description: 거래처명
 *                 original_image:
 *                   type: string
 *                   description: 제품 이미지
 *                 provider_code:
 *                   type: string
 *                   description: 거래처 PK
 *                 product_category_code:
 *                   type: string
 *                   description: 카테고리 PK
 *                 created_at:
 *                   type: string
 *                   description: 물자 생성 일시
 *       500:
 *         description: 서버 오류
 */
router.get("/materials", async (req, res) => {
  try {
    const materials = await Material.getAll();
    res.status(200).json(materials);
  } catch (error) {
    console.error("물자 목록 조회 오류:", error);
    res
      .status(500)
      .json({ message: "물자 목록 조회 실패", error: error.message });
  }
});

// Update a material by PK
/**
 * @swagger
 * /products/materials/{pk}:
 *   put:
 *     summary: 물자 정보를 수정합니다.
 *     description: 주어진 PK로 물자 정보를 수정합니다.
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 물자 고유 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_code:
 *                 type: string
 *                 description: 상품 코드
 *               product_name:
 *                 type: string
 *                 description: 제품명
 *               product_sale:
 *                 type: string
 *                 description: 원가
 *               provider_name:
 *                 type: string
 *                 description: 거래처명
 *               original_image:
 *                 type: string
 *                 description: 제품 이미지
 *               provider_code:
 *                 type: string
 *                 description: 거래처 PK
 *               product_category_code:
 *                 type: string
 *                 description: 카테고리 PK
 *     responses:
 *       200:
 *         description: 물자 수정 성공
 *       404:
 *         description: 물자를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/materials/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const material = new Material(req.body);
    material.pk = pk;

    await material.update();
    res.status(200).json(material);
  } catch (error) {
    console.error("물자 수정 오류:", error);
    res.status(500).json({ message: "물자 수정 실패", error: error.message });
  }
});

// Delete a material by PK
/**
 * @swagger
 * /products/materials/{pk}:
 *   delete:
 *     summary: 물자를 삭제합니다.
 *     description: 주어진 PK로 물자를 삭제합니다.
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 물자 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 물자 삭제 성공
 *       404:
 *         description: 물자를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/materials/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    await Material.deleteByPk(pk);
    res.status(200).json({ message: "물자 삭제 성공" });
  } catch (error) {
    console.error("물자 삭제 오류:", error);
    res.status(500).json({ message: "물자 삭제 실패", error: error.message });
  }
});

// Create a new product
/**
 * @swagger
 * /products:
 *   post:
 *     summary: 새로운 상품을 생성합니다.
 *     description: 제공된 정보를 바탕으로 새로운 상품을 생성합니다.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_code
 *               - branch_id
 *               - product_name
 *               - product_price
 *               - product_image
 *             properties:
 *               product_code:
 *                 type: string
 *                 description: 상품 코드
 *               branch_id:
 *                 type: string
 *                 description: 지점 ID
 *               product_name:
 *                 type: string
 *                 description: 상품명
 *               product_price:
 *                 type: integer
 *                 description: 판매가
 *               product_image:
 *                 type: string
 *                 description: 상품 이미지 URL
 *               blurred_image:
 *                 type: string
 *                 description: 미리보기 방지 이미지 URL
 *     responses:
 *       201:
 *         description: 상품 생성 성공
 *       400:
 *         description: 필수 필드 누락
 *       500:
 *         description: 서버 오류
 */
router.post("/", async (req, res) => {
  try {
    const {
      product_code,
      branch_id,
      product_name,
      product_price,
      product_image,
    } = req.body;

    if (
      !product_code ||
      !branch_id ||
      !product_name ||
      !product_price ||
      !product_image
    ) {
      return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
    }

    const product = new Product(req.body);
    const createdProduct = await product.create();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("상품 생성 오류:", error);
    res.status(500).json({ message: "상품 생성 실패", error: error.message });
  }
});

// Get a product by PK
/**
 * @swagger
 * /products/{PK}:
 *   get:
 *     summary: 상품 정보를 조회합니다.
 *     description: 주어진 PK로 상품 정보를 조회합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: PK
 *         required: true
 *         description: 상품 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 상품 조회 성공
 *       404:
 *         description: 상품을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/:PK", async (req, res) => {
  try {
    const { PK } = req.params;
    const product = await Product.getByPK(PK);
    res.status(200).json(product);
  } catch (error) {
    console.error("상품 조회 오류:", error);
    res.status(500).json({ message: "상품 조회 실패", error: error.message });
  }
});

// Get all products
/**
 * @swagger
 * /products:
 *   get:
 *     summary: 모든 상품 정보를 조회합니다.
 *     description: 모든 상품 정보를 조회하여 반환합니다.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: 상품 리스트 조회 성공
 *       500:
 *         description: 서버 오류
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.getAll();
    res.status(200).json(products);
  } catch (error) {
    console.error("상품 목록 조회 오류:", error);
    res
      .status(500)
      .json({ message: "상품 목록 조회 실패", error: error.message });
  }
});

// Update a product by PK
/**
 * @swagger
 * /products/{PK}:
 *   put:
 *     summary: 상품 정보를 수정합니다.
 *     description: 주어진 PK로 상품 정보를 수정합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: PK
 *         required: true
 *         description: 상품 고유 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_code:
 *                 type: string
 *               branch_id:
 *                 type: string
 *               product_name:
 *                 type: string
 *               product_price:
 *                 type: integer
 *               product_image:
 *                 type: string
 *               blurred_image:
 *                 type: string
 *     responses:
 *       200:
 *         description: 상품 수정 성공
 *       404:
 *         description: 상품을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/:PK", async (req, res) => {
  try {
    const { PK } = req.params;
    const {
      product_code,
      branch_id,
      product_name,
      product_price,
      product_image,
      blurred_image,
    } = req.body;

    const product = new Product({
      PK,
      product_code,
      branch_id,
      product_name,
      product_price,
      product_image,
      blurred_image,
    });
    const updatedProduct = await product.update();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("상품 수정 오류:", error);
    res.status(500).json({ message: "상품 수정 실패", error: error.message });
  }
});

// Delete a product by PK
/**
 * @swagger
 * /products/{PK}:
 *   delete:
 *     summary: 상품을 삭제합니다.
 *     description: 주어진 PK로 상품을 삭제합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: PK
 *         required: true
 *         description: 상품 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 상품 삭제 성공
 *       404:
 *         description: 상품을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/:PK", async (req, res) => {
  try {
    const { PK } = req.params;
    const result = await Product.deleteByPK(PK);
    res.status(200).json(result);
  } catch (error) {
    console.error("상품 삭제 오류:", error);
    res.status(500).json({ message: "상품 삭제 실패", error: error.message });
  }
});

module.exports = router;
