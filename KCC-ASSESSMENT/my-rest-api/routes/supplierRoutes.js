const express = require("express");
const router  = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.sqljson);

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
})
router.use(express.json());

router.get("/show", (req,res) => {
    var sql = "SELECT * FROM supplier";
    con.query(sql, function (err,results,fields) {
        if(err) throw err;
        res.status(200).send(results);
    })
});

router.post("/showwithcid", (req,res) => {
    var sql = `SELECT supplier.supplierid,supplier.suppliername FROM supplier INNER JOIN comptosupplink ON supplier.supplierid = comptosupplink.supplierid WHERE comptosupplink.componentid = ?`;
    const {componentid} = req.body;
    con.query(sql,[componentid], function(err,result) {
        if(err) throw err;
        res.status(200).send(result);
    });
});


module.exports = router;