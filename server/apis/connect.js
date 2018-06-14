const router = require('express').Router();

const FacebookAccount = require('../models/FacebookAccount');

router.use('/facebook-account', FacebookAccount.connectRouter);

module.exports = router;
