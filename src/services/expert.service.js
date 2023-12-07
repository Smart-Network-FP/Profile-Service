const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

module.exports = ({ Expert }) => {
  /**
   * Create an Expert
   * @param {Model} Expert - The Expert model.
   * @param {Object} expertBody - The expert data.
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
   * @param {Model} Expert - The Expert model.
   * @param {Object} filter - Mongo filter.
   * @param {Object} options - Query options.
   * @returns {Promise<QueryResult>}
   */
  const queryExperts = async (filter, options) => {
    return Expert.paginate(filter, options);
  };

  /**
   * Query for experts by search term
   * @param {Model} Expert - The Expert model.
   * @param {string} keyword - Search keyword.
   * @param {Object} filter - Mongo filter.
   * @param {Object} options - Query options.
   * @returns {Promise<QueryResult>}
   */
  const queryExpertsSearch = async (keyword, filter, options) => {
    const regex = new RegExp(keyword, 'i');
    const query = {
      $or: [{ firstName: regex }, { lastName: regex }, { industry: regex }, { email: regex }],
    };
    return Expert.paginate(query, options);
  };

  /**
   * Get expert by id
   * @param {Model} Expert - The Expert model.
   * @param {ObjectId} id - The expert id.
   * @returns {Promise<Expert>}
   */
  const getExpertById = async (id) => {
    return Expert.findById(id);
  };

  /**
   * Get expert by email
   * @param {Model} Expert - The Expert model.
   * @param {string} email - The expert email.
   * @returns {Promise<Expert>}
   */
  const getExpertByEmail = async (email) => {
    return Expert.findOne({ email });
  };

  /**
   * Update expert by id
   * @param {Model} Expert - The Expert model.
   * @param {ObjectId} expertId - The expert id.
   * @param {Object} updateBody - The data to update.
   * @returns {Promise<Expert>}
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
   * @param {Model} Expert - The Expert model.
   * @param {ObjectId} expertId - The expert id.
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

  return {
    createExpert,
    queryExperts,
    queryExpertsSearch,
    getExpertById,
    getExpertByEmail,
    updateExpertById,
    deleteExpertById,
  };
};
