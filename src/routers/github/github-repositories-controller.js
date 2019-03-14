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
        return this.extractContributiorsInformation(data);
    },
    extractContributiorsInformation: function(data) {
        $('body').empty();
        $('body').append(data);

        const contributors = [];
        const contributorsElements = $('.d-block.Box');
        contributorsElements.map(function() {
            let information = $(this).text();
            let nameElement = $(this).find('[data-hovercard-type="user"]');
            let name = '$$$';
            if(nameElement.length >= 2) {
                name = nameElement[1].text;
            }

            information = information.replace(/#[0-9]/g, '').replace(/--.*/, '').replace(name, '');

            let match = '';
            const record = {};
            record.name = name;
            const keys = ['contributions', 'additions', 'deletions'];
            let keyIndex = 0;
            information += '.';
            for(let i = 0; i < information.length; i++) {
                if (!isNaN(parseInt(information[i], 10))) {
                    // Is a number
                    match += information[i];
                } else if(information[i] === ',') {
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