const githubService = require('../../services/githubService');

const controller = {
    getRepositoryInformation: async function(username, repositoryName) {
        const data = await githubService.getUserRepositoryInformation(username, repositoryName);
        return this.extractRepositoryInformation(data);
    },
    extractRepositoryInformation: function(data) {
        return data;
    }
};

module.exports = controller;