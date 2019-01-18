const githubController = require('../routers/github/github-controller');
const usersController = require('../routers/github/github-users-controller');
const indexationConstants = require('../constants/indexationConstants');
const { to } = require('await-to-js');
let followingUsers = ['fabpot'];

const indexator = {
    start: async function(userRepository) {
        this.userRepository = userRepository;
        while(followingUsers.length) {
            const [err, quote] = await to(this.extractUser(followingUsers[0]));
            followingUsers.shift();
            await this.waitSomeTime(indexationConstants.timeout);
        }
    },
    extractUser: async function(username) {
        username = username.toLowerCase();
        let data = await githubController.getUserContributions(username);
        let followers = await githubController.getUserFollowers(username);

        followers.forEach(follower => {
            follower = follower.toLowerCase();
            if(!followingUsers.includes(follower)) { 
                followingUsers.push(follower);
            }
        });

        const completeUser = githubController.addUsername(username, data);
        usersController.updateUsers(this.userRepository, completeUser);

        // eslint-disable-next-line no-console
        console.log(followingUsers[0] + ' was added');
        return completeUser;
    },

    waitSomeTime: async function(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
};

module.exports = indexator;