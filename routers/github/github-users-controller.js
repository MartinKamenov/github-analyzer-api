const usersController = {
    getAllUsers: async function(userRepository) {
        const users = await userRepository.getAllUsers();
        return users;
    }
};

module.exports = usersController;