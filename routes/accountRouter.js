const express = require("express");
const router = express.Router();

/** @swagger
 * tags:
 *   name: Account
 *   description: Account
 */

/**
 * @swagger
 * /account/list:
 *   get:
 *     tags:
 *       - Account
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
 * */
router.get("/list", (req, res) => {
  res.send("account");
});

module.exports = router;
