var express = require('express'); // Express App include
var mysql = require('mysql'); // Mysql include

var router = express.Router();

var connection = mysql.createConnection({ // Mysql Connection
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'imdb',
});

// get all actors
router.route('/').get(function(req, res){

    connection.query("select * from actors order by id limit 10", function(err, rows, fields){
        if (err){
            console.log(err);
            throw err;
        }
        if(rows.length != 0){
            var actors = [];
            rows.forEach(function(row){
                var actor = {};
                actor._id = row.id;
                actor.first_name = row.first_name;
                actor.last_name = row.last_name;
                actor.gender = row.gender;
                actors.push(actor);
            });
            res.json(actors);
        }else{
            res.json({message: 'no books found..'});
        }
    });
});

module.exports = router;