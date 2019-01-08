const { Router } = require('express');
const errorConstants = require('../../constants/errorConstants');
const responceStatus = require('../../constants/responceStatus');

const attach = (app) => {
    const router = Router();
    router
        .get('/', (req, res) => {
            const route = '/';
            res.status(responceStatus.notFoundStatus).send(route + errorConstants.notFoundMessage);
        })
        .get('/:other', (req, res) => {
            const route = req.params.other;
            res.status(responceStatus.notFoundStatus).send(route + errorConstants.notFoundMessage);
        })
        .post('/:other', (req, res) => {
            const route = req.params.other;
            res.status(responceStatus.notFoundStatus).send(route + errorConstants.notFoundMessage);
        });

    app.use('/', router);
};

module.exports = attach;