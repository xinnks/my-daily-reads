const { Unsubscribe } = require("./../fns")

exports.handler = async (event, context, callback) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed', headers: { 'Allow': 'POST' } }
  }

  const {otp} = JSON.parse(event.body)
  if (!otp) {
    return { statusCode: 422, body: `${!otp?'otp, ':''} is required.` }
  }

  try{
    const unsubscriptionResponse = await Unsubscribe({otp: parseInt(otp)});

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