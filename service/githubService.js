const fetch = require('isomorphic-fetch');
const githubUrl = "https://github.com/";

const githubService = {
    getGithubAccountPage: async (account) => {
        const responce = await fetch(githubUrl + account);

        if(!responce.ok) {
            throw Error('Couldn\'t connect to github');
        }

        return responce.text();
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