const { Subscribe } = require("./../fns")

exports.handler = async (event, context, callback) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed', headers: { 'Allow': 'POST' } }
  }

  const {name, email, keywords} = JSON.parse(event.body)
  if (!name || !email || !keywords) {
    return { statusCode: 422, body: `${!name?'name, ':''}${!email?'email, ':''}${!keywords?'keywords, ':''} are required.` }
  }

  try{
    // filter keywords  
    let filteredKeywords = keywords.match(/^([\w]+[ ]*[,]*[ ]*[\w]+)/gi);
    let escapedKeywordsData = filteredKeywords.length ? filteredKeywords.join(",") : filteredKeywords.join("");

    const subscriptionResponse = await Subscribe([{name, email, keywords: escapedKeywordsData}], 'comptes');
    console.error("subscriptionResponse: -- ", subscriptionResponse);

    let message = {message: subscriptionResponse};
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(message)
    })
  }
  catch (e) {
    console.error("ERROR", e);
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify(e)
    });
  }
}