class Repository {
    constructor(username, repositoryName, contributors, languages) {
        this.username = username;
        this.repositoryName = repositoryName;
        this.contributors = contributors;
        this.languages = languages;
    }
}

module.exports = Repository;