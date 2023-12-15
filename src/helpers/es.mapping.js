module.exports = 
{
    properties: {
      firstName: {
        type: 'text',
      },
      lastName: {
        type: 'text',
      },
      email: {
        type: 'keyword', // keyword type for exact match
      },
      industry: {
        type: 'text',
      },
      phoneNumber: {
        type: 'keyword',
      },
      country: {
        type: 'keyword',
      },
      state: {
        type: 'keyword',
      },
      city: {
        type: 'keyword',
      },
      language: {
        type: 'keyword',
      },
      experience: {
        properties: {
          role: {
            type: 'text',
          },
          startDate: {
            type: 'date',
          },
          endDate: {
            type: 'date',
          },
          company: {
            type: 'keyword',
          },
          location: {
            type: 'keyword',
          },
          description: {
            type: 'text',
          },
        },
      },
      expertise: {
        properties: {
          skill: {
            type: 'text',
          },
          level: {
            type: 'keyword',
          },
          years: {
            type: 'keyword',
          },
          description: {
            type: 'text',
          },
        },
      },
      summary: {
        type: 'text',
      },
    },
  };
