const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const database = require('./database/connector');
const UserRepository = require('./models/repositories/UserRepository');
const userRepository = new UserRepository(database, 'users');
const errorRoute = require('./routers/error/error-route');
const githubRoute = require('./routers/github/github-route');
const cors = require('cors');
const setupObject = require('./setup/setup');

const start = (setupConfiguration) => {
    app.use(cors());

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

    githubRoute(app, userRepository);
    errorRoute(app);
    
    const message = 'Magic is running on ' + setupConfiguration.port;
    app.listen(setupConfiguration.port,
        setupConfiguration.startCallback());
};

start(setupObject);