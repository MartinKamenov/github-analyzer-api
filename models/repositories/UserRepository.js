class UserRepository {
    constructor(database, collectionName) {
        this.database = database;
        this.collectionName = collectionName;
    }
    getAllUsers() {
        return this.database.showAll(this.collectionName);
    }

    addUser(user) {
        return this.database.insert(this.collectionName, user);
    }

    findUserByUsername(username) {
        return this.database.find(this.collectionName, {username});
    }
}

module.exports = UserRepository;