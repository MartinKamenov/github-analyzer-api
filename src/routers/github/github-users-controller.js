const paging = require('../../services/paging');
const sorting = require('../../services/sorting');
const filtering = require('../../services/filtering');

const usersController = {
    getAllUsers: async function(req, userRepository) {
        const query = req.query;
        let page = parseInt(query.page, 10);
        let pageSize = parseInt(query.pagesize);
        let sortBy = query.sortBy;
        if(!sortBy) {
            sortBy = 'totalContributionsCount';
        }

        let users = await userRepository.getAllUsers();
        users = filtering.filterCollection(users, query);
        users = sorting.sortDescendingCollectionByKey(users, 'data', sortBy);
        const pagingObject = paging.getPagingOptions(users, page, pageSize);
        users = paging.getCollectionPage(users, page, pageSize);

        const returnObject = {
            users,
            page: pagingObject.page,
            pageSize: pagingObject.pageSize,
            pagesCount: pagingObject.pagesCount,
            count: pagingObject.count
        };
        return returnObject;
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
        if(!user.data || user.data.totalContributionsCount === undefined || user.data.totalContributionsCount === null) {
            return;
        }
        const username = user.username;
        const hasUserWithUserUsername = await this.hasUserWithUsername(userRepository, username);
        if(!hasUserWithUserUsername) {
            await userRepository.addUser(user);
        } else {
            await userRepository.updateUser(username, user);
        }
        return user;
    }
};

module.exports = usersController;