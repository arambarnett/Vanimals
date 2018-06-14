const router = require('express').Router();

const KittyCore = require('../models/KittyCoreContract');

router.use('/kitty-core', KittyCore.contractRouter);

module.exports = router;
