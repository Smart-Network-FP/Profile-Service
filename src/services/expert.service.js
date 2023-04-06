const httpStatus = require('http-status');
const { Expert } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an Expert
 * @param {Object} expertBody
 * @returns {Promise<Expert>}
 */
const createExpert = async (expertBody) => {
  if (await Expert.isEmailTaken(expertBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return Expert.create(expertBody);
};

/**
 * Query for experts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryExperts = async (filter, options) => {
  const experts = await Expert.paginate(filter, options);
  return experts;
};

/**
 * Get expert by id
 * @param {ObjectId} id
 * @returns {Promise<Expert>}
 */
const getExpertById = async (id) => {
  return Expert.findById(id);
};

/**
 * Get expert by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getExpertByEmail = async (email) => {
  return Expert.findOne({ email });
};

/**
 * Update expert by id
 * @param {ObjectId} expertId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateExpertById = async (expertId, updateBody) => {
  const expert = await getExpertById(expertId);
  if (!expert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
  }
  if (updateBody.email && (await Expert.isEmailTaken(updateBody.email, expertId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(expert, updateBody);
  await expert.save();
  return expert;
};

/**
 * Delete expert by id
 * @param {ObjectId} expertId
 * @returns {Promise<Expert>}
 */
const deleteExpertById = async (expertId) => {
  const expert = await getExpertById(expertId);
  if (!expert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
  }
  await expert.remove();
  return expert;
};

module.exports = {
  createExpert,
  queryExperts,
  getExpertById,
  getExpertByEmail,
  updateExpertById,
  deleteExpertById,
};