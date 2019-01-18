const githubController = require('../routers/github/github-controller');
const usersController = require('../routers/github/github-users-controller');
const indexationConstants = require('../constants/indexationConstants');
const { to } = require('await-to-js');
let followingUsers = ['fabpot'];
let counter = 0;

const indexator = {
    start: async function(userRepository) {
        this.userRepository = userRepository;
        //await this.updateCurrentUsers(userRepository);
        while(followingUsers.length) {
            const [err, quote] = await to(this.extractUser(followingUsers[0]));
            followingUsers.shift();
            // eslint-disable-next-line no-console
            console.log(++counter);
            await this.waitSomeTime(indexationConstants.timeout);
        }
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
        await usersController.updateUsers(this.userRepository, completeUser);

        // eslint-disable-next-line no-console
        console.log(followingUsers[0] + ' was added');
        return completeUser;
    },

    updateCurrentUsers: async function(userRepository) {
        const users = await userRepository.getAllUsers();
        const usernames = users.map((u) => u.username);
        for(let i = 0; i < usernames.length; i++) {
            const user = await githubController.getCompleteUser(usernames[i]);
            await usersController.updateUsers(userRepository, user);
        }
    },

    waitSomeTime: async function(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
};

module.exports = indexator;