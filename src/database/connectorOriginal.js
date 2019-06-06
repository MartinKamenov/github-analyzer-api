const Database = require('./mongodb');
const username = process.env.username || require('../../../credentials/credentialManager').username;
const password = process.env.password || require('../../../credentials/credentialManager').password;
const connectionstring = `mongodb://${username}:${password}@ds233367-a0.mlab.com:33367,ds233367-a1.mlab.com:33367/githubanalyzator?replicaSet=rs-ds233367`;
const database = new Database(connectionstring);

module.exports = database;