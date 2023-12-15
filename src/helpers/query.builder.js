const buildElasticsearchQuery = (params) => {
  // [TODO] for some reason the term query for multiple words is not working
  const {
    filter: { firstName, lastName, industry, email },
    searchText,
  } = params;

  let must = [];
  let should = [];

  // Add term queries for exact matches if parameters are provided
  if (firstName) {
    must.push({ term: { firstName: firstName } });
  }
  if (lastName) {
    must.push({ term: { lastName: lastName } });
  }
  if (industry) {
    must.push({ term: { industry: industry } });
  }
  if (email) {
    must.push({ term: { email: email } });
  }

  // Add a multi-field search if searchText is provided
  if (searchText) {
    should = [
      { match: { firstName: searchText } },
      { match: { lastName: searchText } },
      { match: { industry: searchText } },
      { match: { email: searchText } },
    ];
  }

  // Build the final query
  let query;
  if (must.length > 0 || should.length > 0) {
    query = {
      bool: {
        must: must,
        should: should,
        minimum_should_match: should.length > 0 ? 1 : 0,
      },
    };
  } else {
    query = { match_all: {} };
  }

  return query;
};

module.exports = buildElasticsearchQuery;
