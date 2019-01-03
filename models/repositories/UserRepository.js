class UserRepository {
    constructor(database, collectionName) {
        this.database = database;
        this.collectionName = collectionName;
    }
    getAllUsers() {
        return this.database.showAll(this.collectionName);
    }
}

module.exports = UserRepository;