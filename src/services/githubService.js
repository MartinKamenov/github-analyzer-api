const fetch = require('isomorphic-fetch');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const githubUrl = 'https://github.com/';

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

const screen = {
    width: 640,
    height: 480
};
let driver = new webdriver.Builder()
                .withCapabilities(webdriver.Capabilities.chrome())
                .setChromeOptions(new chrome.Options().headless().windowSize(screen))
                .build();

const githubService = {
    getGithubAccountPage: async function(account) {
        const data = await this.fetchData(githubUrl + account);
        return data;
    },

    getGithubAccountPageFromYear: async function(account, year) {
        let queryParam = '?';
        queryParam += `tab=overview&from=${year}-12-01&to=${year}-12-31`;
        const data = await this.fetchData(githubUrl + account + queryParam);
        return data;
    },

    getUserRepositoriesInformation: async function(account) {
        const queryParam = '?tab=repositories';
        const data = await this.fetchData(githubUrl + account + queryParam);
        return data;
    },

    getUserFollowersInformation: async function(account, afterParam) {
        let queryParam = '?tab=followers';
        if(afterParam) {
            queryParam += '&' + afterParam;
        }
        const data = await this.fetchData(githubUrl + account + queryParam);
        return data;
    },

    getUserRepositoryInformation: async function(username, repositoryName) {
        const data = await this.fetchData(githubUrl + username + '/' + repositoryName);
        return data;
    },

    getRepositoryInformation: async function(username, repositoryName) {
        const data = await this.fetchData(githubUrl + username + '/' + 
        repositoryName);
        return data;
    },

    getUserRepositoryContributors: async function(username, repositoryName) {
        const data = await this.fetchDataUsingSelenium(githubUrl + username + '/' + 
        repositoryName + '/graphs/contributors', 2000);
        return data;
    },

    fetchData: async(url) => {
        const responce = await fetch(url);
        if(!responce.ok) {
            throw Error('Couldn\'t connect to github');
        }

        return responce.text();
    },

    fetchDataUsingSelenium: async function(url, timeout) {                        
        await driver.get(url);
        await this.sleep(timeout);
        const pageSource = await driver.getPageSource();
        return pageSource;
    },

    sleep: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    extractDataFromContributions: (pictureUrl, 
        dateContributionsNumbers, 
        fullDateConributionInformation) => {
        let totalContributionsCount = 0;
        let daysWithoutContributions = 0;
        let conclussiveContributions = 0;
        let maxContributionsForDay = 0;
        let currentConclussive = 0;
        
        dateContributionsNumbers.forEach((d, i) => {
            totalContributionsCount += d;

            if(d > maxContributionsForDay) {
                maxContributionsForDay = d;
            }

            if(!d) {
                if(currentConclussive > conclussiveContributions) {
                    conclussiveContributions = currentConclussive;
                }
                currentConclussive = 0;
                daysWithoutContributions++;
            } else {
                currentConclussive++;
            }

            if(i == dateContributionsNumbers.length - 1) {
                if(currentConclussive > conclussiveContributions) {
                    conclussiveContributions = currentConclussive;
                }
            }
        });

        return {
            pictureUrl,
            totalContributionsCount,
            daysWithoutContributions,
            conclussiveContributions,
            maxContributionsForDay,
            dateContributionsNumbers,
            fullDateConributionInformation
        };
    }
};

module.exports = githubService;