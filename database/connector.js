const Database = require('./mongodb');
/*const username = process.env.username;
const password = process.env.password;*/
const username = 'mkusermk';
const password = 'blu3isth3color';
const connectionstring = `mongodb://${username}:${password}@ds125713.mlab.com:25713/githubanalyzatordb`;
const database = new Database(connectionstring);

module.exports = database;