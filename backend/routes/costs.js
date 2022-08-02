var express = require('express');
var router = express.Router();
const db = require('../models');
const Op = db.Sequelize.Op;
const Cost = db.costs;
const asyncHandler = require('express-async-handler');
const { integerCheckFormater } = require('../utils/checker');


/* 查詢花費紀錄 */
router.get('/', asyncHandler(async (req, res, next) => {

    let { limit, offset } = req.query;
    if (limit !== undefined) limit = integerCheckFormater(limit, 1, 20);
    if (offset !== undefined) offset = integerCheckFormater(offset, 0, undefined);


    const costs = await Cost.findAll({
        limit,
        offset
    });

    res.json({
        success: true,
        costs,
        limit,
        offset
    });
}));

// 增加花費紀錄
router.post('/', function (req, res, next) {
    const { name, cash, remark } = req.body;

    Cost.create({ name, cash, remark }).then(data => {
        res.json({ success: true, ...data })
    }).catch(err => {
        res.json({ success: false, msg: 'Add cost failed...' })
    });

});
module.exports = router;
