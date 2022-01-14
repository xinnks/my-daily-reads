require('dotenv').config();
const { SendContentEmails } = require("./../fns")

exports.handler = async (event, context, callback) => {

  const data = event.body ? JSON.parse(event.body) : '';
  if(!data.secret || (data.secret && (data.secret !== process.env.CRON_REQUEST_SECRET))){
    return { statusCode: 403, body: `Unauthorized request.` }
  }

  try{
    const mailContentToUsers = await SendContentEmails();
  
    let message, statusCode;
    
    if(mailContentToUsers === "Successfully completed task."){
      console.log("HERE 1: ", mailContentToUsers);
    } else {
      console.log("HERE 2: ", mailContentToUsers);
      message = {message: mailContentToUsers};
      statusCode = 500;
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