const usersController = {
    getAllUsers: async function(userRepository) {
        const users = await userRepository.getAllUsers();
        return users;
    },

    findUserByUsername: async function(userRepository, username) {
        const foundUsers = await userRepository.findUserByUsername(username);
        return foundUsers;
    },

    hasUserWithUsername: async function(userRepository, username) {
        const foundUsers = await userRepository.findUserByUsername(username);
        if(foundUsers.length > 0) {
            return true;
        }

        return false;
    },

    updateUsers: async function(userRepository, user) {
        const username = user.username;
        const hasUserWithUserUsername = await this.hasUserWithUsername(userRepository, username);
        if(!hasUserWithUserUsername) {
            await userRepository.addUser(user);
        } else {
            // Update current user
        }
        return user;
    }
};

module.exports = usersController;