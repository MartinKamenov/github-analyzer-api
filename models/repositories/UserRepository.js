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

    updateUser(username, newUser) {
        return this.database.update(this.collectionName, {username}, newUser);
    }
}

module.exports = UserRepository;