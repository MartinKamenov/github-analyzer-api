const Database = require('./mongodb');
/*const username = process.env.username;
const password = process.env.password;*/
const username = 'mkuser';
const password = 'blu3isth3color';
const connectionstring = `mongodb://${username}:${password}@ds233367-a0.mlab.com:33367,ds233367-a1.mlab.com:33367/githubanalyzator?replicaSet=rs-ds233367`;
const database = new Database(connectionstring);

module.exports = database;