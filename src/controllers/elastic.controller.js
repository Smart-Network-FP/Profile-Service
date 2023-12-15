const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { elasticService } = require('../services');

module.exports = (client, services) => ({
  createMapping: catchAsync(async (req, res) => {
    await services.elasticService.createMapping(req.params.index);
    res.status(httpStatus.NO_CONTENT).send();
  }),
  search: catchAsync(async (req, res) => {
    const { query } = req.body;
    const result = await services.elasticService.searchQuery(query);
    res.status(httpStatus.OK).json(result);
  }),
  deleteIndex: catchAsync(async (req, res) => {
    const index = req.params.index;
    await services.elasticService.deleteIndex(index);
    res.status(httpStatus.NO_CONTENT).send();
  }),
});
