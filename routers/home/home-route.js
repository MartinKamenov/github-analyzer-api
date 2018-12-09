const { Router } = require('express');
const controller = require('./home-controller');

const attach = (app) => {
    const router = Router();
    router
    .get('/', (req, res) => {
        const result = controller.showHome();
        res.send(result);
    });

    app.use('/', router);
}

module.exports = attach;