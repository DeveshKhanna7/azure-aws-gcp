#npm init -y
#npm install aws-sdk axios

const AWS = require('aws-sdk');
const axios = require('axios');

AWS.config.update({
  accessKeyId: 'YOUR_AWS_ACCESS_KEY',
  secretAccessKey: 'YOUR_AWS_SECRET_KEY',
  region: 'YOUR_AWS_REGION',
});

const comprehend = new AWS.Comprehend();

const getTweets = async () => {
  const response = await axios.get('https://api.twitter.com/2/tweets/sample/stream', {
    headers: {
      Authorization: 'Bearer YOUR_TWITTER_API_KEY',
    },
  });

  return response.data.data;
};

const analyzeSentiment = async (text) => {
  const params = {
    LanguageCode: 'en',
    Text: text,
  };

  return comprehend.detectSentiment(params).promise();
};

const processTweets = async () => {
  try {
    const tweets = await getTweets();

    for (const tweet of tweets) {
      const sentimentResult = await analyzeSentiment(tweet.text);
      const sentiment = sentimentResult.Sentiment;
      console.log(`Tweet: ${tweet.text}`);
      console.log(`Sentiment: ${sentiment}`);
      console.log('---');
    }
  } catch (error) {
    console.error(error);
  }
};

processTweets();
