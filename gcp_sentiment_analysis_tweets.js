#npm init -y
#npm install @google-cloud/language axios

const { LanguageServiceClient } = require('@google-cloud/language');
const axios = require('axios');

const languageClient = new LanguageServiceClient();

const getTweets = async () => {
  const response = await axios.get('https://api.twitter.com/2/tweets/sample/stream', {
    headers: {
      Authorization: 'Bearer YOUR_TWITTER_API_KEY',
    },
  });

  return response.data.data;
};

const analyzeSentiment = async (text) => {
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  const [result] = await languageClient.analyzeSentiment({ document });

  return result.sentiment;
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
