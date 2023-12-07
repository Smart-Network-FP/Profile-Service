const axios = require('axios');

const openAIApi = axios.create({
  baseURL: 'https://api.openai.com/v1/chat/completions', // or whichever engine you're using
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.GPT_API_SECRET}`,
  },
});

module.exports = openAIApi;
