const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const _ = require('lodash');
const ESMapping = require('../helpers/es.mapping');
const buildElasticsearchQuery = require('../helpers/query.builder');
const { sanitizeData } = require('../helpers/utils');

module.exports = (client) => {
  return {
    createMapping: async (index) => {
      try {
        await client.indices.create(
          {
            index,
            body: {
              mappings: ESMapping,
              settings: {
                number_of_shards: 1,
                number_of_replicas: 0,
                analysis: {
                  analyzer: {
                    default: {
                      type: 'standard',
                    },
                  },
                },
              },
            },
          },
          { ignore: [400] }
        );
      } catch (err) {
        console.log(err);
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot Create Index');
      }
    },
    searchQuery: async (queryParam, index = 'profiles') => {
      console.log('queryParam', queryParam);
      try {
        const query = buildElasticsearchQuery({
          ...queryParam,
        });
        console.log('query', query);
        const queryParams = {
          query: query,
          size: 100, // Set the size for pagination
          _source: ['firstName', 'lastName', 'email', 'industry'],
        };

        console.log('Elasticsearch Query:', JSON.stringify(queryParams, null, 2));

        const { hits, ...remain } = await client.search({
          index,
          ...queryParams,
        });

        // Process the hits
        console.log('body -> hits', hits);
        console.log('remain -> hits', remain);

        return sanitizeData(_.get(hits, 'hits', [])); // This will return the array of search hits.
      } catch (err) {
        console.log(err);
        throw new ApiError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
      }
    },
    indexOrUpdateProfile: async (profileData, index = 'profiles') => {
      try {
        const { id, ...otherData } = profileData;
        const dataObj = _.omit(otherData, ['password']);
        await client.index({
          index,
          id,
          body: dataObj,
          op_type: 'create',
        });
      } catch (err) {
        if (err.statusCode === 409) {
          // Document already exists, update it
          await client.update({
            index,
            id: profileData.id,
            body: {
              doc: profileData,
            },
          });
        } else {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot index or update profile');
        }
      }
    },
    deleteIndex: async (index) => {
      try {
        await client.indices.delete(
          {
            index,
          },
          { ignore: [400] }
        );
      } catch (err) {
        console.log(err);
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot Delete Index');
      }
    },
  };
};
