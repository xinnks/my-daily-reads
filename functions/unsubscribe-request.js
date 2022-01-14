const { UnsubscriptionRequest } = require("./../fns")

exports.handler = async (event, context, callback) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed', headers: { 'Allow': 'POST' } }
  }

  const { email } = JSON.parse(event.body)
  if (!email) {
    return { statusCode: 422, body: `${!email?'email, ':''} is required.` }
  }

  try{

    const unsubscriptionResponse = await UnsubscriptionRequest(email);

    let message = {message: unsubscriptionResponse};
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