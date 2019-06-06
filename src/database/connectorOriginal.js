const Database = require('./mongodb');
const username = process.env.githubAnalyzatorUser || 
    require('../../../credentials/credentialManager').githubAnalyzatorUser;
const password = process.env.githubAnalyzatorPassword || 
    require('../../../credentials/credentialManager').githubAnalyzatorPassword;
const connectionstring = `mongodb://${username}:${password}@ds233367-a0.mlab.com:33367,ds233367-a1.mlab.com:33367/githubanalyzator?replicaSet=rs-ds233367`;
const database = new Database(connectionstring);

module.exports = database;