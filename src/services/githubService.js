const fetch = require('isomorphic-fetch');
const githubUrl = "https://github.com/";

const githubService = {
    getGithubAccountPage: async function(account) {
        const data = await this.fetchData(githubUrl + account);
        return data;
    },

    getGithubAccountPageFromYear: async function(account, year) {
        let queryParam = "?";
        queryParam += `tab=overview&from=${year}-12-01&to=${year}-12-31`;
        const data = await this.fetchData(githubUrl + account + queryParam);
        return data;
    },

    getUserRepositoriesInformation: async function(account) {
        const queryParam = "?tab=repositories";
        const data = await this.fetchData(githubUrl + account + queryParam);
        return data;
    },

    fetchData: async(url) => {
        const responce = await fetch(url);
        if(!responce.ok) {
            throw Error('Couldn\'t connect to github');
        }

        return responce.text();
    },
    extractDataFromRepositories: (pictureUrl, repositoriesInfo) => {
        return {
            pictureUrl,
            repositoriesInfo
        };
    },
    extractDataFromContributions: (pictureUrl, dateContributionsNumbers) => {
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
            dateContributionsNumbers
        };
    }
}

module.exports = githubService;