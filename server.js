const express = require('express');
const app = express();
const database = require('./database/connector');
const UserRepository = require('./models/repositories/UserRepository');
const userRepository = new UserRepository(database, 'users');
const homeRoute = require('./routers/home/home-route');
const githubRoute = require('./routers/github/github-route');
const cors = require('cors');
app.use(cors());

homeRoute(app);
githubRoute(app, userRepository);

const port = process.env.PORT || 5000;
const message = 'Magic is running on ' + port;
app.listen(port,
    () => console.log(message));