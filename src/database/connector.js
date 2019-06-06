const Database = require('./mongodb');
const username = process.env.username || require('../../../credentials/credentialManager').username;
const password = process.env.password || require('../../../credentials/credentialManager').password;
const connectionstring = `mongodb://${username}:${password}@ds125713.mlab.com:25713/githubanalyzatordb`;
const database = new Database(connectionstring);

module.exports = database;