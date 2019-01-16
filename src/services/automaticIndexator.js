const githubController = require('../routers/github/github-controller');
const usersController = require('../routers/github/github-users-controller');
let followingUsers = [];

const indexator = {
    start: function(userRepository, timeout) {
        this.userRepository = userRepository;
        //setInterval(this.extractUser, timeout);
        this.extractUser('gaearon');
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
    }
};

module.exports = indexator;