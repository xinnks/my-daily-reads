const {client, dbName} = require('./client');

/**
 * @description This function deletes multiple docs at once
 * @param { Object } query => The query to match docs to delete
 * @param { String } collection => Collection name
**/
const deleteManyDocuments = async (query, collection) => new Promise(async (resolve, reject) => {
  // Use connect method to connect to the server
  try {
    await client.connect();
    console.log('Connected successfully to server [deleteManyDocuments]');
    const db = client.db(dbName);
    const dbCollection = db.collection(collection) || db.collection('sources');
    
    query = query || { title: "None" };

    const result = await dbCollection.deleteMany(query);

    resolve(result.deletedCount);
  } catch(e) {
    // TODO: Send error log email
  } finally {
    await client.close();
  }
});

module.exports = {
  deleteManyDocuments
}