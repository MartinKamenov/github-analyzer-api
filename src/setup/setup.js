const githubService = require('../services/githubService');

const setupObject = {
    port: process.env.PORT || 5000,
    message: 'Magic is running on ',
    pinServerOnInterval: (timeout) => {
        const url = 'https://github-analyzator-api.herokuapp.com/';
        setInterval(() => {
            githubService.fetchData(url);
        }, timeout);
    },
    startCallback: function() {
        // eslint-disable-next-line no-console
        console.log(this.message + this.port);
    }
};

module.exports = setupObject;