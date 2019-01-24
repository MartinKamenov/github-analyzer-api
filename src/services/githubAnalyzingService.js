const sorting = require('../services/sorting');

const githubAnalyzingService = {
    analyzeProfile: function(repositories) {
        const repositoriesAnalyze = this.analyzeRepositories(repositories);
        
        return {
            repositoriesAnalyze
        };
    },

    analyzeRepositories: function(repositories) {
        let programmingLanguages = [];

        repositories.map(r => r.programmingLanguage).forEach((repo) => {
            const indexOfRepo = programmingLanguages.map(p => p.repo).indexOf(repo);
            if(indexOfRepo === -1) {
                programmingLanguages.push({ repo, count: 1 });
            } else {
                programmingLanguages[indexOfRepo].count++;
            }
        });

        programmingLanguages = sorting.sortDescendingCollectionByKey(programmingLanguages, 'count');

        return programmingLanguages.slice(0, 5);
    }
};

module.exports = githubAnalyzingService;