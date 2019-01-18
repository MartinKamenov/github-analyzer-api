const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = require('jquery')(window);
const githubService = require('../../services/githubService');

const controller = {
    getCompleteUser: async function(username) {
        const contributions = await this.getUserContributions(username);
        const repositories = await this.getUserRepositoriesInformation(username);
        const followers = await this.getUserFollowers();

        return {
            username,
            data: contributions,
            repositories,
            followers
        };
    },
    getUserContributions: async function(username) {
        const data = await githubService.getGithubAccountPage(username);
        return this.extractContributionInfoFromData(data);
    },

    getUserContributionsForYear: async function(username, year) {
        const data = await githubService.getGithubAccountPageFromYear(username, year);
        return this.extractContributionInfoFromData(data);
    },

    getUserRepositoriesInformation: async function(username) {
        const data = await githubService.getUserRepositoriesInformation(username);
        return this.extractRepositoryInfoFromData(data);
    },

    getUserFollowers: async function(username) {
        const data = await githubService.getUserFollowersInformation(username);
        let followers = this.extractFollowersInfoFromData(data);

        let startIndex = 0;
        for(let i = 0; i < followers.length; i++) {
            if(followers[i].includes('Dismiss') || followers[i].includes('us feedback')) {
                startIndex = i + 1;
            }
        }

        followers = followers.slice(startIndex, followers.length);
        return followers;
    },

    extractFollowersInfoFromData: function(data) {
        $('body').empty();
        $('body').append(data);
        
        const usernameElements = $('.link-gray');
        const usernames = [];
        usernameElements.map(function() {
            const name = $(this).text();
            usernames.push(name);
        });

        return usernames;
    },

    extractRepositoryInfoFromData: function(data) {
        $('body').empty();
        $('body').append(data);

        //const pictureUrl = this.extractProfilePictureUrl();

        const repositoryElements = $('[itemprop="name codeRepository"]');
        const repositoriesInfo = [];
        repositoryElements.map(function() {
            const name = $(this).text().replace('\n', '').replace(/\s/g, '');
            repositoriesInfo.push({name});
        });

        const repositoryLanguages = $('[itemprop="programmingLanguage"]');
        repositoryLanguages.map(function(index) {
            const fullLanguage = $(this).parent().text().replace(/\s/g, '');
            const language = fullLanguage.substring(0, fullLanguage.indexOf('Updated'));
            repositoriesInfo[index].programmingLanguage = language;
        });

        return repositoriesInfo;
    },

    extractContributionInfoFromData: function(data) {
        $('body').empty();
        $('body').append(data);
        const dates = $('.day');

        const pictureUrl = this.extractProfilePictureUrl();

        const dateContributions = [];
        dates.map(function() {
            dateContributions.push($(this).attr('data-count'));
        });
        const dateContributionsNumbers = dateContributions.map(d => parseInt(d));
        return githubService.extractDataFromContributions(pictureUrl, dateContributionsNumbers);
    },

    extractProfilePictureUrl: function() {
        const photoElements = $('.u-photo img');
        let pictureUrl = '';
        photoElements.map(function() {
            pictureUrl = $(this).attr('src');
        });

        return pictureUrl;
    },

    addUsername(username, data) {
        return { username, data };
    },
    parseDataObject(...data) {
        const resultObject = { data };
        return resultObject;
    },

    parsePofilesToArray(...profiles) {
        return profiles;
    }
};

module.exports = controller;