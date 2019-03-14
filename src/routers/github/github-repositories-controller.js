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
            let information = $(this).text();
            information = information.replace(/#[0-9]/g, '').replace(/--.*/, '');
            const numberIndex = information.search(/\d/);
            const name = information.substring(0, numberIndex);
            let rest = information.substring(numberIndex, information.length);

            let match = '';
            const record = {};
            record.name = name;
            const keys = ['contributions', 'additions', 'deletions'];
            let keyIndex = 0;
            rest += '.';
            for(let i = 0; i < rest.length; i++) {
                if (!isNaN(parseInt(rest[i], 10))) {
                    // Is a number
                    match += rest[i];
                } else if(rest[i] === ',') {
                    continue;
                } else if(match.length > 0) {
                    record[keys[keyIndex++]] = parseInt(match);
                    match = '';
                }
            }

            contributors.push(record);
        });
        
        return contributors;
    }
};

module.exports = controller;