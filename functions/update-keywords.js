const { UpdateKeywords } = require("./../fns")

exports.handler = async (event, context, callback) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed', headers: { 'Allow': 'POST' } }
  }

  const { otp, keywords } = JSON.parse(event.body)
  if (!otp || !keywords) {
    return { statusCode: 422, body: `${!otp?'otp, ':''}${!keywords?'keywords, ':''} are required.` }
  }
  console.log(`update keywords to: [${keywords}] for otp number request: [${typeof otp}] ${otp}`);

  // filter keywords
  let filteredKeywords = keywords.match(/^([.]*[\w]+[ ]*[,]*[ ]*[.]*[\w]+)/gi);
  let escapedKeywordsData = filteredKeywords.length ? filteredKeywords.join(",") : filteredKeywords.join("");

  try{
    const updatedKeywordsData = await UpdateKeywords({ otp: parseInt(otp) }, { keywords: escapedKeywordsData });
  
    let message;
    if(updatedKeywordsData == "No user with email!"){
      console.log("HERE 1: ", updatedKeywordsData);
      message = {message: "This account does not exist."};
    }
    if(updatedKeywordsData == "OTP does not exist!"){
      console.log("HERE 2: ", updatedKeywordsData);
      message = {message: "No keywords update request has been made for this account."};
    }
    if(updatedKeywordsData == "OTP expired!"){
      console.log("HERE 3: ", updatedKeywordsData);
      message = {message: "This one time password(OTP) has expired."};
    }
    if(updatedKeywordsData == "Could not send OTP email!"){
      console.log("HERE 4: ", updatedKeywordsData);
      message = {message: "Sorry we've encountered an error on our side, please retry."};
    }
    if(updatedKeywordsData == "Could not delete OTP row!"){
      console.log("HERE 4: ", updatedKeywordsData);
      message = {message: "Sorry we've encountered an error on our side, please retry."};
    }
    if(updatedKeywordsData == "Successfully changed keywords!"){
      console.log("HERE 4: ", updatedKeywordsData);
      message = {message: "You have successfully changed the keywords to your daily dev content."};
    }
  
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