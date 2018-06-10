const router = require('express').Router();

const contracts = require('./contracts');

router.use('/contracts', contracts);

module.exports = router;
