const router = require('express').Router();

const contracts = require('./contracts');
const connect = require('./connect');

router.use('/contracts', contracts);
router.use('/connect', connect);

module.exports = router;
