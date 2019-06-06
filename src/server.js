const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const originalDatabase = require('./database/connectorOriginal');
const UserRepository = require('./models/repositories/UserRepository');
const RepoRepository = require('./models/repositories/RepoRepository');
const originalUserRepository = new UserRepository(originalDatabase, 'users');
const originalRepoRepository = new RepoRepository(originalDatabase, 'repositories');
const errorRoute = require('./routers/error/error-route');
const githubRoute = require('./routers/github/github-route');
const cors = require('cors');
const setupObject = require('./setup/setup');
const automaticIndexator = require('./services/automaticIndexator');

const start = (setupConfiguration) => {
    app.use(cors());

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

    githubRoute(app, originalUserRepository, originalRepoRepository);
    errorRoute(app);

    app.listen(setupConfiguration.port,
        setupConfiguration.startCallback());

    //automaticIndexator.start(originalUserRepository);
};

start(setupObject);