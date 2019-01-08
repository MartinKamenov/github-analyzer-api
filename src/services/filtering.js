const filtering = {
    filterCollection(collection, filterObject) {
        return collection.filter(record => {
            for(let key in filterObject) {
                if(!record[key] && record[key] != 0) {
                    continue;
                }
                if(!('' + record[key]).toLowerCase().includes(('' + filterObject[key]).toLowerCase())) {
                    return false;
                }
            }

            return true;
        });
    }
};

module.exports = filtering;