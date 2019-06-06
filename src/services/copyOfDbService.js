const copyDbService = {
    copyDb: async () => {
        const originalUsers = await originalUserRepository.getAllUsers();
        let users = await userRepository.getAllUsers();
        users = users.reverse();
        users = users.filter((u) => !originalUsers
            .find((originalUser) => u.username === originalUser.username));
        console.log(users.length);
        let userIndex = 1;
        users.forEach(async (user) => {
            await originalUserRepository.addUser(user);
            console.log(user.username + 'was added ' + (userIndex++) + '/' + users.length);
        });    
    }
};

module.exports = copyDbService;