class RepoRepository {
    constructor(database, collectionName) {
        this.database = database;
        this.collectionName = collectionName;
    }

    getAllRepositories() {
        return this.database.showAll(this.collectionName);
    }

    addRepository(repository) {
        return this.database.insert(this.collectionName, repository);
    }

    findRepositoryByUsernameAndRepositoryName(username, repositoryName) {
        return this.database.find(this.collectionName, {username, repositoryName});
    }

    updateRepository(username, repositoryName, newRepo) {
        return this.database.update(this.collectionName, {username, repositoryName}, newRepo);
    }
}

module.exports = RepoRepository;