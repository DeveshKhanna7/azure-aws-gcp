#npm init -y
#npm install axios

const axios = require('axios');
const twitterApiKey = 'YOUR_TWITTER_API_KEY';
const textAnalyticsApiKey = 'YOUR_AZURE_TEXT_ANALYTICS_API_KEY';
const textAnalyticsEndpoint = 'YOUR_AZURE_TEXT_ANALYTICS_ENDPOINT';

const getTweets = async () => {
  const response = await axios.get('https://api.twitter.com/2/tweets/sample/stream', {
    headers: {
      Authorization: `Bearer ${twitterApiKey}`,
    },
  });

  return response.data.data;
};

const analyzeSentiment = async (text) => {
  const response = await axios.post(`${textAnalyticsEndpoint}/text/analytics/v3.0/sentiment`, {
    documents: [{ id: '1', text }],
  }, {
    headers: {
      'Ocp-Apim-Subscription-Key': textAnalyticsApiKey,
      'Content-Type': 'application/json',
    },
  });

  return response.data.documents[0].sentiment;
};

const processTweets = async () => {
  try {
    const tweets = await getTweets();

    for (const tweet of tweets) {
      const sentiment = await analyzeSentiment(tweet.text);
      console.log(`Tweet: ${tweet.text}`);
      console.log(`Sentiment: ${sentiment}`);
      console.log('---');
    }
  } catch (error) {
    console.error(error);
  }
};

processTweets();
