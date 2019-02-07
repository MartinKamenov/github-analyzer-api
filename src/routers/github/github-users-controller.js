const paging = require('../../services/paging');
const sorting = require('../../services/sorting');
const filtering = require('../../services/filtering');
const memorizing = require('../../services/memorizing');

const usersController = {
    getAllUsers: async function(req, userRepository) {
        const query = req.query;
        let page = parseInt(query.page, 10);
        let pageSize = parseInt(query.pagesize);
        let sortBy = query.sortBy;
        if(!sortBy) {
            sortBy = 'totalContributionsCount';
        }

        let programmingLanguage = query.language;

        let users = [];

        if(!memorizing['allUsers'])
        {
            memorizing['allUsers'] = await userRepository.getAllUsers();
        }
        
        users = memorizing['allUsers'];
        users = filtering.filterCollection(users, query);
        if(programmingLanguage) {
            users = users.filter((user) => {
                const profileAnalyze = user.profileAnalyze;
                if(!profileAnalyze) {
                    return false;
                }

                const repositoriesAnalyze = profileAnalyze.repositoriesAnalyze;
                if(!repositoriesAnalyze || repositoriesAnalyze.length === 0) {
                    return false;
                }

                const userMainLanguageObject = repositoriesAnalyze[0];
                if(!userMainLanguageObject) {
                    return false;
                }
                const userMainLanguage = userMainLanguageObject.repo;
                if(userMainLanguage === programmingLanguage) {
                    return true;
                }

                return false;
            });
        }
        if(sortBy === 'username') {
            users = sorting.sortAscendingCollectionByKey(users, sortBy);
        } else if(sortBy === 'daysWithoutContributions'){
            users = sorting.sortAscendingCollectionByKey(users, 'data', sortBy);
        } else {
            users = sorting.sortDescendingCollectionByKey(users, 'data', sortBy);
        }
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