const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = require('jquery')(window);
const githubService = require('../../services/githubService');
const githubAnalyzingService = require('../../services/githubAnalyzingService');

const controller = {
    getSavedUser: async function(username, userRepository) {
        const users = await userRepository.findUserByUsername(username);
        if(!users.length) {
            return null;
        }

        return users[0];
    },
    getCompleteUser: async function(username) {
        const contributions = await this.getUserContributions(username);
        const repositories = await this.getUserRepositoriesInformation(username);
        const followers = await this.getUserFollowers(username);

        const profileAnalyze = githubAnalyzingService.analyzeProfile(contributions, repositories);

        return {
            profileAnalyze,
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
        let followers = [];
        let shouldContinue = true;
        let afterParam = null;

        while(shouldContinue) {
            const data = await githubService.getUserFollowersInformation(username, afterParam);
            let followersInfo = this.extractFollowersInfoFromData(data);
            followersInfo.followers.forEach(f => followers.push(f));
            afterParam = followersInfo.afterParam;
            shouldContinue = followersInfo.shouldContinue;
        }
        
        return followers;
    },

    extractFollowersInfoFromData: function(data) {
        $('body').empty();
        $('body').append(data);

        let shouldContinue = false;
        
        const usernameElements = $('.link-gray');
        let followers = [];
        usernameElements.map(function() {
            const name = $(this).text();
            followers.push(name);
        });

        let afterParam = null;
        let srcToNextPage = null;
        const afterElement = $('a:contains("Next")');
        if(afterElement.length) {
            srcToNextPage = afterElement[0].href;
        }

        if(srcToNextPage) {
            afterParam = srcToNextPage.substring(srcToNextPage.indexOf('?') + 1, srcToNextPage.indexOf('&'));
            shouldContinue = true;
        }

        let startIndex = 0;
        for(let i = 0; i < followers.length; i++) {
            if(followers[i].includes('Dismiss') || followers[i].includes('us feedback')) {
                startIndex = i + 1;
            }
        }

        followers = followers.slice(startIndex, followers.length);

        return { shouldContinue, followers, afterParam };
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
            let language = fullLanguage.substring(0, fullLanguage.indexOf('Updated'));

            let indexOfNumber = fullLanguage.search(/\d/);
            let indexOfMIT = fullLanguage.search(/MIT/);
            if(indexOfNumber === -1) {
                indexOfNumber = fullLanguage.length;
            }

            if(indexOfMIT === -1) {
                indexOfMIT = fullLanguage.length;
            }
            let lastIndex = Math.min(indexOfNumber, indexOfMIT);

            language = language.substring(0, lastIndex);
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