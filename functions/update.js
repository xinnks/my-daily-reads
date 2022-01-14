require('dotenv').config();
const { KeywordsUpdateRequest } = require("./../fns")

exports.handler = async (event, context, callback) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed', headers: { 'Allow': 'POST' } }
  }

  const { email } = JSON.parse(event.body)
  if (!email) {
    return { statusCode: 422, body: `${!email?'email ':''} is required.` }
  }
  console.log(`update keywords for user with email: ${email}`);

  try{
    const subscriptionResponse = await KeywordsUpdateRequest({ email: email}, process.env.USER_COLLECTION);
    
    // options
    // "No user with email!"
    // "Could not create OTP row!"
    // "Could not send OTP email!"
    // "Email Sent!"
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