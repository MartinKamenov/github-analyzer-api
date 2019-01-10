const sorting = {
    sortDescendingCollectionByKey: (collection, ...keys) => {
        if(!collection.length) {
            return collection;
        }

        return collection.sort((a, b) => {
            let firstFinalProp = a;
            let lastFinalProp = b;
            keys.forEach(key => {
                firstFinalProp = firstFinalProp[key];
                lastFinalProp = lastFinalProp[key];
            });

            if(firstFinalProp instanceof Date && lastFinalProp instanceof Date) {
                return firstFinalProp.getTime() - lastFinalProp.getTime();
            }

            if(typeof firstFinalProp === 'string') {
                firstFinalProp = firstFinalProp.toString().toLowerCase();
                lastFinalProp = lastFinalProp.toString().toLowerCase();
            }

            if(firstFinalProp < lastFinalProp) {
                return 1;
            } else if(firstFinalProp > lastFinalProp) {
                return -1;
            } else {
                return 0;
            }
        });
    },

    sortAscendingCollectionByKey: (collection, ...keys) => {
        if(!collection.length) {
            return collection;
        }

        
        return collection.sort((a, b) => {
            let firstFinalProp = a;
            let lastFinalProp = b;
            keys.forEach(key => {
                firstFinalProp = firstFinalProp[key];
                lastFinalProp = lastFinalProp[key];
            });

            if(firstFinalProp instanceof Date && lastFinalProp instanceof Date) {
                return firstFinalProp.getTime() - lastFinalProp.getTime();
            }

            firstFinalProp = firstFinalProp.toString().toLowerCase();
            lastFinalProp = lastFinalProp.toString().toLowerCase();

            if(firstFinalProp < lastFinalProp) {
                return -1;
            } else if(firstFinalProp > lastFinalProp) {
                return 1;
            } else {
                return 0;
            }
        });
    }
};

module.exports = sorting;