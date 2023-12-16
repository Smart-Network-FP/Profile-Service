const express = require('express');
const router = express.Router();

/**
 * @typedef {import('@elastic/elasticsearch').Client} ESClient
 * @typedef {import('../../services/')} Service
 * @typedef {import('../../controllers/')} Controller
 */

/**
 * @param {ESClient} elasticClient
 * @param {Service} services
 * @param {Controller} controller
 *
 */
module.exports = (elasticClient, services, { gptController }) => {
  router.post('/prompt', gptController.promptTokenization);
  router.post('/summary', gptController.promptSummarizeRequest);
  return router;
};
/**
 * @swagger
 * tags:
 *   name: GPT
 *   description: GPT endpoint
 */
/**
 * @swagger
 * /prompt:
 *   post:
 *     summary: Sends a prompt to GPT-3 and receives a response.
 *     tags: [GPT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *             example:
 *               message: "What is the capital of France?"
 *     responses:
 *       "200":
 *         description: Response from GPT-3
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *             example:
 *               response: "The capital of France is Paris."
 */
