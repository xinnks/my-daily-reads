require('dotenv').config();
const { fetchDevToArticlesFromAPI, formatPostsDataSchema, formatDate, dateDifference } = require("./content");
const { deleteManyDocuments, insertDocuments, fetchAllCollectionData } = require("./db");

/**
 * @description This function fetches and compiles the latest content from sources, formats to a preffered schema and stores them into the database
**/
const CollectContentForDay = () => new Promise(async (resolve, reject) => {
  let message;
  let devToContent = await fetchDevToArticlesFromAPI(1, 5);
  let formattedDevToContent = await formatPostsDataSchema(devToContent, 0, devToContent.length, 'dev.to');
  
  const allContent = formattedDevToContent;
  let today = new Date();
  let todayInsertDate = formatDate(today, "dashedDate");
  const allContentWithInsertDate = allContent.map(post => ({...post, insertDate: todayInsertDate}));
  
  let existingContentStash = await fetchAllCollectionData(process.env.CONTENT_COLLECTION);
  if(existingContentStash){
    const deleteExistingDBData = await deleteManyDocuments('', process.env.CONTENT_COLLECTION);
    if(!deleteExistingDBData){
      message = "Could not delete documents";
      // resolve(message);
      // TODO: send error log email
    }
  }
  
  const submitDataToDB = await insertDocuments(allContentWithInsertDate, process.env.CONTENT_COLLECTION);
  if(!submitDataToDB){
    message = "Could not submit documents";
    // TODO: send error log email
    return resolve(message);
  }

  message = "Successfully added daily content.";
  resolve(message);
});

module.exports = {
  CollectContentForDay
}