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
          title: {
            type: 'text',
          },
          startDate: {
            type: 'date',
          },
          endDate: {
            type: 'date',
          },
          companyName: {
            type: 'keyword',
          },
          description: {
            type: 'text',
          },
        },
      },
      expertise: {
        properties: {
          skills: {
            type: 'text',
          },
          country: {
            type: 'keyword',
          },
          company: {
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
