const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = require('jquery')(window);
const githubService = require('../../services/githubService');

const controller = {
    getRepositoryInformation: async function(username, repositoryName) {
        const data = await githubService.getUserRepositoryContributors(username, repositoryName);
        return this.extractRepositoryInformation(data);
    },
    extractRepositoryInformation: function(data) {
        $('body').empty();
        $('body').append(data);

        const contributors = [];
        const contributorsElements = $('.d-block.Box');
        contributorsElements.map(function() {
            const name = $(this).text();
            contributors.push(name);
        });
        return contributors;
    }
};

module.exports = controller;