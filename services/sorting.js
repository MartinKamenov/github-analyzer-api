const sorting = {
    sortDescendingCollectionByKey: (collection, key) => {
        if(!collection.length) {
            return collection;
        }

        if(collection[0][key] instanceof Date) {  
            return collection.sort((a, b) => b[key].getTime() - a[key].getTime());
        } else {
            return collection.sort((a, b) => b[key] - a[key]);
        }
    },

    sortAscendingCollectionByKey: (collection, key) => {
        if(!collection.length) {
            return collection;
        }

        if(collection[0][key] instanceof Date) {  
            return collection.sort((a, b) => a[key].getTime() - b[key].getTime());
        } else {
            return collection.sort((a, b) => a[key] - b[key]);
        }
    }
};

module.exports = sorting;