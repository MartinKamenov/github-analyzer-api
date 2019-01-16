const githubController = require('../routers/github/github-controller');
const usersController = require('../routers/github/github-users-controller');
const indexationConstants = require('../constants/indexationConstants');
let followingUsers = ['gaearon'];

const indexator = {
    start: async function(userRepository) {
        this.userRepository = userRepository;
        while(followingUsers.length) {
            await this.extractUser(followingUsers[0]);
            await this.waitSomeTime(indexationConstants.timeout);
        }
    },
    extractUser: async function(username) {
        username = username.toLowerCase();
        let data = await githubController.getUserContributions(username);
        let followers = await githubController.getUserFollowers(username);
        let startIndex = 0;
        for(let i = 0; i < followers.length; i++) {
            if(followers[i].includes('Dismiss')) {
                startIndex = i + 1;
                break;
            }
        }

        followers = followers.slice(startIndex, followers.length);
        followers.forEach(follower => {
            follower = follower.toLowerCase();
            if(!followingUsers.includes(follower)) { 
                followingUsers.push(follower);
            }
        });

        const completeUser = githubController.addUsername(username, data);
        usersController.updateUsers(this.userRepository, completeUser);
        console.log(followingUsers[0] + ' was added');
        followingUsers.shift();
    },

    waitSomeTime: async function(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
};

module.exports = indexator;