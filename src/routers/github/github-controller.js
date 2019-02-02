const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = require('jquery')(window);
const githubService = require('../../services/githubService');
const githubAnalyzingService = require('../../services/githubAnalyzingService');
const indexationConstants = require('../../constants/indexationConstants');

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

        const profileAnalyze = githubAnalyzingService
            .analyzeProfile(contributions, repositories, followers);

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
            await this.waitSomeTime(indexationConstants.followersTimeout);
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
        //const descriptionElements = $('[itemprop="description"]');
        const repositoriesInfo = [];
        let self = this;

        repositoryElements.map(function() {
            const parentElement = $(this).parent().parent().parent();
            const name = $(this).text().replace('\n', '').replace(/\s/g, '');
            
            let programmingLanguage = null;
            let description = null;

            const programmingLanguageElements = parentElement.find('[itemprop="programmingLanguage"]');
            const descriptionElements = parentElement.find('[itemprop="description"]');

            if(programmingLanguageElements.length > 0) {
                const programmingLanguageElement = programmingLanguageElements[0];
                if(programmingLanguageElement.textContent) {
                    const fullLanguage = programmingLanguageElement.textContent.replace(/\s/g, '');
                    programmingLanguage = self.removeLicenseFromRepo(fullLanguage);
                }
            }

            if(descriptionElements.length > 0) {
                const descriptionElement = descriptionElements[0];
                if(descriptionElement.textContent) {
                    description = descriptionElement.textContent.trim();
                }
            }

            repositoriesInfo.push({ name, programmingLanguage, description });
        });

        return repositoriesInfo;
    },

    removeLicenseFromRepo: function(language) {
        const licenses = [/MIT.*/, /\d.*/, /The.*/, /Other.*/, /Apache.*/, /GNU.*/];
        for(let i = 0; i < licenses.length; i++) {
            language = language.replace(licenses[i],'');
        }
        return language;
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
    },

    waitSomeTime: async function(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
};

module.exports = controller;