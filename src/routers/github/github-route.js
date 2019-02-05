const { Router } = require('express');
const controller = require('./github-controller');
const userController = require('./github-users-controller');
const responceStatus = require('../../constants/responceStatus');
const errorConstants = require('../../constants/errorConstants');

const attach = (app, userRepository) => {
    const router = Router()
        .get('/user/:username', async (req, res) => {
            let username = req.params.username;
            username = username.toLowerCase();
            
            let completeUser = await controller.getSavedUser(username, userRepository);
            if(!completeUser) {
                completeUser = await controller.getCompleteUser(username);
            }

            res.send(completeUser);

            completeUser = await controller.getCompleteUser(username);
            userController.updateUsers(userRepository, completeUser);
        })
        .get('/contributions/:firstusername/:secondusername', async (req, res) => {
            let firstUsername = req.params.firstusername;
            firstUsername = firstUsername.toLowerCase();
            let secondUsername = req.params.secondusername;
            secondUsername = secondUsername.toLowerCase();
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

            res.status(responceStatus.successStatus).send(result);
            
            const firstUser = controller.getCompleteUser(firstUsername);
            userController.updateUsers(userRepository, firstUser);
            const secondUser = controller.getCompleteUser(secondUsername);
            userController.updateUsers(userRepository, secondUser);
        })
        .get('/contributions/:username', async (req, res) => {
            let username = req.params.username;
            username = username.toLowerCase();
            const year = req.query.year;
            let data;
            if(year) {
                data = await controller.getUserContributionsForYear(username, year);
            } else {
                data = await controller.getUserContributions(username);
            }
            const result = controller.addUsername(username, data);
            res.status(responceStatus.successStatus).send(result);

            const user = await controller.getCompleteUser(username);
            userController.updateUsers(userRepository, user);
        })
        .get('/repositories/:username', async (req, res) => {
            const username = req.params.username;
            const data = await controller.getUserRepositoriesInformation(username);
            const result = controller.addUsername(username, data);

            res.status(responceStatus.successStatus).send(result);
        })
        .get('/users', async (req, res) => {
            const users = await userController.getAllUsers(req, userRepository);

            res.status(responceStatus.successStatus).send(users);
        })
        .get('/:other', async(req, res) => {
            const route = req.params.other;

            res.status(404).send('Get ' + route + errorConstants.notFoundMessage);
        })
        .post('/:other', async(req, res) => {
            const route = req.params.other;

            res.status(404).send('Post ' + route + errorConstants.notFoundMessage);
        });
    app.use('/github', router);
};

module.exports = attach;