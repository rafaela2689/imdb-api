var express = require('express'); // Express App include
var mysql = require('mysql'); // Mysql include

var router = express.Router();

var connection = mysql.createConnection({ // Mysql Connection
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'imdb',
});

// get all directors
router.route('/').get(function(req, res){

    connection.query("select * from directors order by id",function(err, rows, fields){
        if(rows.length != 0){
            res.json(rows);
        }else{
            res.json({message: 'no books found..'});
        }
    });
});

// get directors with films
var query1 = "SELECT dir.id AS 'id_director', dir.first_name AS 'first_name', dir.last_name AS 'last_name', mov.id AS 'id_film', mov.name, mov.year, mov.rank FROM directors dir ";
var query2 = "JOIN movies_directors md ON (md.director_id = dir.id) ";
var query3 = "JOIN movies mov ON (mov.id = md.movie_id) ORDER BY dir.id;";
router.route('/movies').get(function(req, res){
    connection.query(query1 + query2 + query3, function(err, rows, fields){
            if (err) {
                console.log(err);
                throw err;
            };       

            if(rows.length != 0){
                var directors = [];
                rows.forEach(function(row){
                    var find = false;
                    directors.forEach(function(d){
                        if (d._id === row.id_director) {
                            var movie = {
                                id_movie : row.id_film,
                                name : row.name,
                                year : row.year,
                                rank : row.rank
                            };
                            d.movies.push(movie);
                            find = true;
                        };
                    });
                    if(!find){
                        var director = {};
                        director._id = row.id_director;
                        director.first_name = row.first_name;
                        director.last_name = row.last_name;
                        director.movies = [];
                        var movie = {
                                id_movie : row.id_film,
                                name : row.name,
                                year : row.year,
                                rank : row.rank
                            };
                        director.movies.push(movie);
                        directors.push(director); 
                    }
                });
                res.json(directors);    
            }else{
                res.json({message: 'no books found..'});
            }
    });
});

module.exports = router;