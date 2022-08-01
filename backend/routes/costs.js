var express = require('express');
const { costs } = require('../models');
var router = express.Router();
const db = require('../models');
const Op = db.Sequelize.Op;
const Cost = db.costs;

/* GET costs listing. */
router.get('/', async function (req, res, next) {
    const costs = await Cost.findAll();

    res.json({
        success: true,
        costs
    });
});


router.post('/', function (req, res, next) {
    const { name, cash, remark } = req.body;
    Cost.create({ name, cash, remark }).then(data => {
        res.json({ success: true, ...data })
    }).catch(err => {
        res.json({ success: false, msg: 'Add cost failed...' })
    });

});
module.exports = router;
