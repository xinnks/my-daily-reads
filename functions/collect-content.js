require('dotenv').config();
const { CollectContentForDay } = require("./../fns")

exports.handler = async (event, context, callback) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 403, body: 'Method Not Allowed', headers: { 'Allow': 'POST' } }
  }

  const data = event.body ? JSON.parse(event.body) : '';
  if(!data.secret || (data.secret && (data.secret !== process.env.CRON_REQUEST_SECRET))){
    return { statusCode: 403, body: `Unauthorized request.` }
  }

  try{
    let collectContent = await CollectContentForDay(data.count || 100);
  
    let message, statusCode;
    if(collectContent === "Could not delete documents"){
      console.log("HERE 1: ", collectContent);
      message = {message: collectContent};
      statusCode = 500;
    }
    if(collectContent === "Could not submit documents"){
      console.log("HERE 2: ", collectContent);
      message = {message: collectContent};
      statusCode = 500;
    }
    if(collectContent === "Successfully added daily content."){
      console.log("HERE 3: ", collectContent);
      message = {message: collectContent};
      statusCode = 200;
    }
    
    return callback(null, {
      statusCode: statusCode || 200,
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