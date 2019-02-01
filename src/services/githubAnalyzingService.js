const sorting = require('../services/sorting');
const sectorTypes = require('../constants/sectorTypes');
const contributionsTypes = require('../constants/contributionsTypes');

const githubAnalyzingService = {
    analyzeProfile: function(data, repositories, followers) {
        const contributionsAnalyze = this.analyzeContributions(data);
        const repositoriesAnalyze = this.analyzeRepositories(repositories);
        const followersStar = this.analyzeFollowers(followers);
        
        return {
            contributionsAnalyze,
            repositoriesAnalyze,
            followersStar
        };
    },

    analyzeContributions: function(data) {
        const numberOfSectors = 4;
        const dateContributionsNumbers = data.dateContributionsNumbers;
        const differenceForLayers = parseInt(data.totalContributionsCount / 10, 10);
        const sectors = [];
        const sectorLength = parseInt(dateContributionsNumbers.length / (numberOfSectors + 1), 10);
        for(let i = 1; i < numberOfSectors + 1; i++) {
            const firstStartIndex = (i - 1) * sectorLength;
            const firstEndIndex = i * sectorLength;
            const secondEndIndex = (i + 1) * sectorLength;
            const firstSector = dateContributionsNumbers
                .slice(firstStartIndex,firstEndIndex);
            const secondSector = dateContributionsNumbers
                .slice(firstEndIndex, secondEndIndex);
            
            const sumOfFirstSector = firstSector.reduce((a, b) => a + b);
            const sumOfSecondSector = secondSector.reduce((a, b) => a + b);

            const differenceSectors = sumOfSecondSector - sumOfFirstSector;
            if(differenceSectors >= differenceForLayers * 2) {
                sectors.push(sectorTypes[0]);
            } else if(differenceSectors >= differenceForLayers) {
                sectors.push(sectorTypes[1]);
            } else if(differenceSectors > -differenceForLayers) {
                sectors.push(sectorTypes[2]);
            } else if(differenceSectors > -differenceForLayers * 2) {
                sectors.push(sectorTypes[3]);
            } else {
                sectors.push(sectorTypes[4]);
            }
        }

        let contributorType = contributionsTypes.NotContributtor;

        if(data.conclussiveContributions > 30 && data.maxContributionsForDay > 50) {
            contributorType = contributionsTypes.OverallContributor;
        } else if(data.maxContributionsForDay > 50) {
            contributorType = contributionsTypes.PeekContributor;
        } else if(data.conclussiveContributions > 50) {
            contributorType = contributionsTypes.ConstantContributor;
        } else if(data.totalContributionsCount > 50) {
            contributorType = contributionsTypes.SmallContributor;
        }

        return { sectors, contributorType };
    },

    analyzeRepositories: function(repositories) {
        let programmingLanguages = [];
        repositories = repositories.filter(r => r.programmingLanguage);
        repositories.map(r => r.programmingLanguage).forEach((repo) => {
            if(!repo) {
                return;
            }
            const indexOfRepo = programmingLanguages.map(p => p.repo).indexOf(repo);
            if(indexOfRepo === -1) {
                programmingLanguages.push({ repo, count: 1 });
            } else {
                programmingLanguages[indexOfRepo].count++;
            }
        });

        programmingLanguages = sorting.sortDescendingCollectionByKey(programmingLanguages, 'count');

        return programmingLanguages.slice(0, 5);
    },

    analyzeFollowers: function(followers) {
        if(followers.length > 100) {
            return true;
        }

        return false;
    }
};

module.exports = githubAnalyzingService;