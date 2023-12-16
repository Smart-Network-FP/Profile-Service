const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

module.exports = (openAIApi) => {
  return {
    gptPrompt: async (prompt) => {
      const payload = {
        max_tokens: 500, // Set the maximum number of tokens for the output here
        model: 'gpt-4',
        // model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      };

      try {
        const response = await openAIApi.post('', payload);
        console.log(response.data.choices[0].message.content);
        return response.data.choices[0].message.content.trim();
      } catch (error) {
        console.log('gptPrompt----------', error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'Something wrong with GPT API');
      }
    },
  };
};
