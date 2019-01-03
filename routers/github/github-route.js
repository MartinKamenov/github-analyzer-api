const { Router } = require('express');
const controller = require('./github-controller');
const userController = require('./github-users-controller');

const attach = (app, userRepository) => {
    const router = Router()
        .get('/contributions/:firstusername/:secondusername', async (req, res) => {
            const firstUsername = req.params.firstusername;
            const secondUsername = req.params.secondusername;
            const year = req.query.year;
            let firstUsernameContributions, secondUsernameContributions;
            if(year) {
                firstUsernameContributions = await controller.getUserContributionsForYear(firstUsername, year);
                secondUsernameContributions = await controller.getUserContributionsForYear(secondUsername, year);
            } else {
                firstUsernameContributions = await controller.getUserContributions(firstUsername);
                secondUsernameContributions = await controller.getUserContributions(secondUsername);
            }
            const firstUserResults = controller.addUsername(firstUsername, firstUsernameContributions);
            const secondUserResults = controller.addUsername(secondUsername, secondUsernameContributions);
            const result = controller.parsePofilesToArray(
                firstUserResults, secondUserResults
            );
            res.send(result);
        })
        .get('/contributions/:username', async (req, res) => {
            const username = req.params.username;
            const year = req.query.year;
            let data;
            if(year) {
                data = await controller.getUserContributionsForYear(username, year);
            } else {
                data = await controller.getUserContributions(username);
            }
            const result = controller.addUsername(username, data);
            res.send(result);
        })
        .get('/repositories/:username', async (req, res) => {
            const username = req.params.username;
            const data = await controller.getUserRepositoriesInformation(username);
            const result = controller.addUsername(username, data);
            res.send(result);
        })
        .get('/users', async (req, res) => {
            const users = await userController.getAllUsers(userRepository);
            res.send(users);
        })
        .post('/users/new', async (req, res) => {
            //const user = req.body;
        });
    app.use('/github', router);
};

module.exports = attach;