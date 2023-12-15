const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
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
module.exports = (elasticClient, services, { elasticController }) => {
  router.post('/mapping/:index', elasticController.createMapping);
  router.post('/search', elasticController.search);
  router.post('/delete/:index', elasticController.deleteIndex);

  return router;
};

// /**
  //  * @swagger
  //  * tags:
  //  *   name: ElasticSearch
  //  *   description: Handling ElasticSearch operations
  //  */

  // /**
  //  * @swagger
  //  * /elasticsearch/mapping/:index
  //  *   post:
  //  *     summary: Create mapping for an index
  //  *     tags: [ES]
  //  *     requestBody:
  //  *       required: true
  //  *       content:
  //  *         application/json:
  //  *           schema:
  //  *             type: object
  //  *             required:
  //  *               - index
  //  *             properties:
  //  *               index:
  //  *                 type: string
  //  *             example:
  //  *               name: index-1
  //  *     responses:
  //  *       "201":
  //  *         $ref: '#/components/responses/IndexCreated'
  //  *       "400":
  //  *         $ref: '#/components/responses/DuplicateEmail'
  //  */

  /**
 * @swagger
 * /elasticsearch/search:
 *   get:
 *     summary: Search in the ElasticSearch index
 *     tags: [ElasticSearch]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *     responses:
 *       "200":
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hits:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Users'
 */

