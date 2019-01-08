const pagingConstants = require('../constants/pagingConstants');

const paging = {
    getCollectionPage(collection, page, pageSize) {
        if(!page) {
            page = pagingConstants.defaultPage;
        }

        if(!pageSize) {
            pageSize = pagingConstants.defaultPageSize;
        }

        const firstIndex = (page - 1) * pageSize;
        let lastIndex = firstIndex + pageSize;
        if(lastIndex > collection.length) {
            lastIndex = collection.length;
        }

        return collection.filter((c, i) => (i >= firstIndex) && (i < lastIndex));
    },

    getPagingOptions(collection, page, pageSize) {
        if(!page) {
            page = pagingConstants.defaultPage;
        }

        if(!pageSize) {
            pageSize = pagingConstants.defaultPageSize;
        }

        const count = collection.length;
        const pagesCount = Math.ceil(count / pageSize);

        return {
            page,
            pageSize,
            pagesCount,
            count
        };
    }
};

module.exports = paging;