const _ = require('lodash');
exports.sanitizeData = function (data) {
  return data.map(({ _id, _source } = { _id: '', _source: {} }) => ({
    id: _id,
    ..._.pick(_source, ['firstName', 'lastName', 'industry', 'email']),
  }));
};
