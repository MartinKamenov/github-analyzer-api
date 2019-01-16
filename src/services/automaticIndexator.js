const githubController = require('../routers/github/github-controller');
const usersController = require('../routers/github/github-users-controller');

const indexator = {
    start: function(userRepository, timeout) {
        this.userRepository = userRepository;
        //setInterval(this.extractUser, timeout);
        this.extractUser('martinkamenov');
    },
    extractUser: async function(username) {
        username = username.toLowerCase();
        let data = await githubController.getUserContributions(username);
        let followers = await githubController.getUserFollowers(username);

        const completeUser = githubController.addUsername(username, data);
        usersController.updateUsers(this.userRepository, completeUser);
    }
};

module.exports = indexator;