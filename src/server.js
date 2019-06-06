const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const database = require('./database/connector');
const originalDatabase = require('./database/connectorOriginal');
const UserRepository = require('./models/repositories/UserRepository');
const RepoRepository = require('./models/repositories/RepoRepository');
const userRepository = new UserRepository(database, 'users');
const originalUserRepository = new UserRepository(originalDatabase, 'users');
const repoRepository = new RepoRepository(database, 'repositories');
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

    githubRoute(app, userRepository, repoRepository);
    errorRoute(app);

    app.listen(setupConfiguration.port,
        setupConfiguration.startCallback());

    //automaticIndexator.start(userRepository);
};

const copyDb = async () => {
    const originalUsers = await originalUserRepository.getAllUsers();
    let users = await userRepository.getAllUsers();
    users = users.reverse();
    let userIndex = 1;
    users.forEach(async (user) => {
        if(originalUsers.find((u) => u.username === user.username)) {
            return;
        }
        await originalUserRepository.addUser(user);
        console.log(user.username + 'was added ' + (userIndex++) + '/' + users.length);
    });    
};

start(setupObject);
copyDb();