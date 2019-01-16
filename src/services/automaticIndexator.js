const githubController = require('../routers/github/github-controller');
const usersController = require('../routers/github/github-users-controller');

const indexator = {
    start: function(usersRepository, timeout) {
        this.usersRepository = usersRepository;
        setInterval(timeout);
    },
    extractUser: async function(username) {
        username = username.toLowerCase();
        let data;
        data = await githubController.getUserContributions(username);
        const completeUser = githubController.addUsername(username, data);
        usersController.updateUsers(this.usersRepository, completeUser);
    }
};

module.exports = indexator;