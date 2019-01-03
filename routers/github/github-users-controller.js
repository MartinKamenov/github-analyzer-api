const usersController = {
    getAllUsers: async function(userRepository) {
        const users = await userRepository.getAllUsers();
        return users;
    },

    addUser: async function(userRepository, user) {
        await userRepository.addUser(user);
        return user;
    }
};

module.exports = usersController;