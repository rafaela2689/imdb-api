var express = require('express'); // Express App include
var mysql = require('mysql'); // Mysql include

var router = express.Router();

var connection = mysql.createConnection({ // Mysql Connection
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'imdb',
});

router.route('/').get(function (req, res) {
	res.json({ message: 'IMDB API'});
});

// get all directors
router.route('/directors').get(function(req, res){

    connection.query("select * from directors order by id",function(err, rows, fields){
        if(rows.length != 0){
            res.json(rows);
        }else{
            res.json({message: 'no books found..'});
        }
    });
});

// get all actors
router.route('/actors').get(function(req, res){

    connection.query("select * from actors order by id", function(err, rows, fields){
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

// get directors with films
var query1 = "SELECT dir.id AS 'id_director', dir.first_name AS 'first_name', dir.last_name AS 'last_name', mov.id AS 'id_film', mov.name, mov.year, mov.rank FROM directors dir ";
var query2 = "JOIN movies_directors md ON (md.director_id = dir.id) ";
var query3 = "JOIN movies mov ON (mov.id = md.movie_id) ORDER BY dir.id;";
router.route('/directors/movies').get(function(req, res){
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

// get movies with directors, roles and actors
var query_actor = "SELECT m.id, m.name, m.year, m.rank, d.id AS 'director_id', d.first_name, d.last_name, r.role, a.id AS 'actor_id', a.first_name AS 'actor_first_name', a.last_name AS 'actor_last_name', a.gender from movies m ";
var query_actor2 = "JOIN movies_directors md ON md.movie_id = m.id ";
var query_actor3 = "JOIN directors d ON d.id = md.director_id ";
var query_actor4 = "JOIN roles r ON r.movie_id = m.id JOIN actors a ON a.id = r.actor_id "; 
var query_5 = "ORDER BY m.id;";
router.route('/movies').get(function(req, res) {
    connection.query(query_actor + query_actor2 + query_actor3 + query_actor4 + query_5, function(err, rows, fields) {
        if (err) {
            console.log(err);
            throw err;
        };
        if (rows.length != 0) {
            var movies = [];
            rows.forEach(function(row) {
                var find = false;
                var director_find = false;
                movies.forEach(function(m) {
                    if (m._id === row.id) {
                        m.directors.forEach(function(d){
                            if (d === row.director_id) {
                                director_find = true;                                
                            };
                        });
                        if (!director_find) {
                            var director = {
                                id_director : row.director_id,
                                first_name : row.first_name,
                                last_name : row.last_name
                            };
                            m.directors.push(director);
                        };
                        var role = {
                             role: row.role, 
                             id_actor: row.actor_id,
                             actor_first_name : row.actor_first_name,
                             actor_last_name : row.actor_last_name,
                             gender : row.gender
                        };
                        m.roles.push(role);
                        find = true;
                    };
                });
                if (!find) {
                    var movie = {};
                    movie._id = row.id;
                    movie.name = row.name;
                    movie.year = row.year;
                    movie.rank = row.rank;
                    movie.directors = [];
                    if (row.director_id) {
                        var director = {
                                id_director : row.director_id,
                                first_name : row.first_name,
                                last_name : row.last_name
                        };
                        movie.directors.push(director);    
                    };
                    movie.roles = [];
                    if (row.role || row.actor_id) {
                         var role = {
                             role: row.role, 
                             id_actor: row.actor_id,
                             actor_first_name : row.actor_first_name,
                             actor_last_name : row.actor_last_name,
                             gender : row.gender
                        };
                        movie.roles.push(role);    
                    };
                    movies.push(movie);
                };
            });
            res.json(movies);
        } else{
            res.json({message: 'no books found...'});
        };
    });
});

// get movies with roles and actors
var query_actor = "SELECT m.id, m.name, m.year, m.rank, r.role, a.id AS 'actor_id', a.first_name, a.last_name, a.gender from movies m ";
var query_actor4 = "JOIN roles r ON r.movie_id = m.id JOIN actors a ON a.id = r.actor_id "; 
var query_5 = "ORDER BY m.id;";
router.route('/movies/roles').get(function(req, res) {
    connection.query(query_actor + query_actor4 + query_5, function(err, rows, fields) {
        if (err) {
            console.log(err);
            throw err;
        };
        if (rows.length != 0) {
            var movies = [];
            rows.forEach(function(row) {
                var find = false;
                movies.forEach(function(m) {
                    if (m._id === row.id) {
                        var role = {
                             role: row.role, 
                             id_actor: row.actor_id,
                             first_name : row.first_name,
                             last_name : row.last_name,
                             gender : row.gender
                        };
                        m.roles.push(role);
                        find = true;
                    };
                });
                if (!find) {
                    var movie = {};
                    movie._id = row.id;
                    movie.name = row.name;
                    movie.year = row.year;
                    movie.rank = row.rank;
                    movie.roles = [];
                    if (row.role || row.actor_id) {
                        var role = {
                             role: row.role, 
                             id_actor: row.actor_id,
                             first_name : row.first_name,
                             last_name : row.last_name,
                             gender : row.gender
                        };
                        movie.roles.push(role);    
                    };
                    movies.push(movie);
                };
            });
            res.json(movies);
        } else{
            res.json({message: 'no books found...'});
        };
    });
});

// get movies with directors
var query_actor = "SELECT m.id, m.name, m.year, m.rank, d.id AS 'director_id', d.first_name, d.last_name from movies m ";
var query_actor2 = "JOIN movies_directors md ON md.movie_id = m.id ";
var query_actor3 = "JOIN directors d ON d.id = md.director_id "; 
var query_5 = "ORDER BY m.id;";
router.route('/movies').get(function(req, res) {
    connection.query(query_actor + query_actor2 + query_actor3 + query_5, function(err, rows, fields) {
        if (err) {
            console.log(err);
            throw err;
        };
        if (rows.length != 0) {
            var movies = [];
            rows.forEach(function(row) {
                var find = false;
                movies.forEach(function(m) {
                    if (m._id === row.id) {
                        var director = {
                                id_director : row.director_id,
                                first_name : row.first_name,
                                last_name : row.last_name
                        };
                        m.directors.push(director);
                        find = true;                                
                    }
                });
                if (!find) {
                    var movie = {};
                    movie._id = row.id;
                    movie.name = row.name;
                    movie.year = row.year;
                    movie.rank = row.rank;
                    movie.directors = [];
                    if (row.director_id) {
                        var director = {
                                id_director : row.director_id,
                                first_name : row.first_name,
                                last_name : row.last_name
                        };
                        movie.directors.push(director);    
                    };
                    movies.push(movie);
                };
            });
            res.json(movies);
        } else{
            res.json({message: 'no books found...'});
        };
    });
});


module.exports = router;