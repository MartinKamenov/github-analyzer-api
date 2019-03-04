/*eslint-disable no-console*/
const githubController = require('../routers/github/github-controller');
const usersController = require('../routers/github/github-users-controller');
const indexationConstants = require('../constants/indexationConstants');
const githubAnalyzingService = require('../services/githubAnalyzingService');
const { to } = require('await-to-js');
let followingUsers = ['taylorotwell'];
let counter = 0;
let totalCount = 1;

const indexator = {
    start: async function(userRepository) {
        this.userRepository = userRepository;
        //await this.updateCurrentUsers(userRepository);
        while(counter < totalCount) {
            const foundUsers = await userRepository
                .findUserByUsername(followingUsers[counter]);
            if(foundUsers.length > 0) {
                const foundUser = foundUsers[0];
                foundUser.followers.forEach(follower => {
                    follower = follower.toLowerCase();
                    if(!followingUsers.includes(follower)) { 
                        followingUsers.push(follower);
                    }
                });

                totalCount = followingUsers.length;
                
                console.log(followingUsers[counter]);
                console.log(++counter);

                continue;
            }

            const [err, quote] = await to(this.extractUser(followingUsers[counter]));
            totalCount = followingUsers.length;

            console.log(followingUsers[counter]);
            console.log(++counter);
            await this.waitSomeTime(indexationConstants.timeout);
        }
        //await this.addAnalyzatorDataToUsers(userRepository);
    },
    extractUser: async function(username) {
        username = username.toLowerCase();
        const completeUser = await githubController.getCompleteUser(username);
        
        let followers = completeUser.followers;

        followers.forEach(follower => {
            follower = follower.toLowerCase();
            if(!followingUsers.includes(follower)) { 
                followingUsers.push(follower);
            }
        });
        totalCount = followingUsers.length;
        await usersController.updateUsers(this.userRepository, completeUser);

        console.log(followingUsers[counter] + ' was added');
        return completeUser;
    },

    updateCurrentUsers: async function(userRepository) {
        const users = await userRepository.getAllUsers();
        const usernames = users.map((u) => u.username);
        for(let i = 0; i < usernames.length; i++) {
            const user = await githubController.getCompleteUser(usernames[i]);
            await usersController.updateUsers(userRepository, user);

            console.log('Updated ' + user.username);
            console.log((i + 1) + '/' + usernames.length);
        }
    },

    addAnalyzatorDataToUsers: async function(userRepository) {
        let users = await userRepository.getAllUsers();
        users = users.filter(u => (!u.profileAnalyze && u.repositories));
        for(let i = 0; i < users.length; i++) {
            let user = users[i];
            const profileAnalyze = githubAnalyzingService
                .analyzeProfile(user.data, user.repositories, user.followers);
            user.profileAnalyze = profileAnalyze;
            await userRepository.updateUser(user.username, user);

            console.log(user.username + ' analyzed. ' + i + '/' + users.length);
        }
    },

    waitSomeTime: async function(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
};

module.exports = indexator;