const express = require('express');
const mysql = require("mysql");
const bodyParser = require('body-parser');
const port = 8080;
var customBody = {};

var isDev = true;
var seeHeaders = false;

var app = express();

const moviesColBlackList = ["id_film", "ddur", "genre", "date_use", "id_genre", "type"];
const personnesColBlackList = ["id_personne", "nationalite", "code", "nomFinal"];

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(function (req, res, next) {
  console.log('Path: ' + req.url + '; Method:', req.method);
  if (seeHeaders) {
  	console.log('Headers => ' + JSON.stringify(req.headers));
  }
  console.log('Body => ' + JSON.stringify(req.body));

  customBody = req.body.body;
  customHeaders = req.headers;

  if (isDev || req.method == "OPTIONS" || customHeaders.bearer == 'ePK1c152AA387aa8866-632FGKYU100rererer6zsX90-RTE652bg7C8ZAxSD-6452nJ8725erFGDT-YUFSREedfffiyodKLNBXWPMPMPMES-67-fnUDfgrts-IOSuiIOFght') {
  	next();
  } else {
  	res.status(404);
  	res.end();
  }
});

// MOVIES
app.get('/movies', function(req, res) {
	selectAllFilmsPromise
		.then((movies) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(movies));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.get('/movies/personnes', function(req, res) {
	selectAllPersonnesInFilmsPromise
		.then((movies) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(movies));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.get('/movies/:idMovie', function(req, res) {
	var idMovie = req.params.idMovie;

	selectFilmByIdPromise(idMovie)
		.then((movies) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(movies));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.get('/movies/titles', function(req, res) {
	selectAllFilmsWithTitlesPromise
		.then((movies) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(movies));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.get('/movies/:idMovie/genres', function(req, res) {
	var idMovie = req.params.idMovie;

	selectFilmGenresPromise(idMovie)
		.then((genres) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(genres));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.get('/movies/lastcreated/:nbrMovies', function(req, res) {
	var nbrMovies = req.params.nbrMovies;

	selectLastCreatedMoviesPromise(nbrMovies)
		.then((movies) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(movies));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.get('/movies/missingjaquette/:nbrMovies', function(req, res) {
	var nbrMovies = req.params.nbrMovies;

	selectNotJaquetteNotDatesMoviesPromise(nbrMovies)
		.then((movies) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(movies));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.get('/movies/missinggenres/:nbrMovies', function(req, res) {
	var nbrMovies = req.params.nbrMovies;

	selectMoviesWithoutGenres(nbrMovies)
		.then((movies) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(movies));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.post('/movies', function(req, res) {
	insertMoviesPromise(customBody)
		.then((result) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(result));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.post('/movies/:idMovie/genres', function(req, res) {
	var idMovie = req.params.idMovie;

	insertMovieGenresPromise(idMovie, customBody)
		.then((result) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(result));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.post('/movies/genres', function(req, res) {
	insertGenresToMoviesPromise(customBody)
		.then((result) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(result));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.put('/movies', function(req, res) {
	updateMoviePromise(customBody)
		.then((result) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(result));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.put('/movies/missingjaquette', function(req, res) {
	updateMoviesJaquetteDateCPromise(customBody)
		.then((result) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(result));
			res.end();
		})
		.catch((error) => console.log(error));
})

// GENRES
app.get('/genres', function(req, res) {
	selectAllGenresPromise
		.then((genres) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(genres));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.post('/genres', function(req, res) {
	insertGenrePromise(customBody)
		.then((createdGenre) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(createdGenre));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.put('/genres', function(req, res) {
	updateGenrePromise(customBody)
		.then((updatedGenre) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(updatedGenre));
			res.end();
		})
		.catch((error) => console.log(error));
})

// DDURS
app.get('/ddurs', function(req, res) {
	selectAllDDurPromise
		.then((ddurs) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(ddurs));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.post('/ddurs', function(req, res) {
	insertDdurPromise(customBody)
		.then((result) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(result));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.put('/ddurs', function(req, res) {
	updateDdurPromise(customBody)
		.then((result) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(result));
			res.end();
		})
		.catch((error) => console.log(error));
})

// PERSONNES
app.get('/personnes', function(req, res) {
	selectAllPersonnesPromise
		.then((personnes) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(personnes));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.get('/personnes/:idPersonne', function(req, res) {
	var idPersonne = req.params.idPersonne;

	selectPersonneByIdPromise(idPersonne)
		.then((personne) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(personne));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.get('/personnes/:idPersonne/movies', function(req, res) {
	var idPersonne = req.params.idPersonne;

	selectAllMoviesFromOnePersonne(idPersonne)
		.then((personne) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(personne));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.get('/personnes/missinginfos/:nbrPersonnes', function(req, res) {
	var nbrPersonnes = req.params.nbrPersonnes;

	selectPersonnesMissingInfos(nbrPersonnes)
		.then((personne) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(personne));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.put('/personnes', function(req, res) {
	updatePersonnePromise(customBody)
		.then((personne) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(personne));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.post('/personnes', function(req, res) {
	insertPersonnePromise(customBody)
		.then((personne) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(personne));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.post('/personnes/:idPersonne/movies', function(req, res) {
	var idPersonne = req.params.idPersonne;

	insertMoviesToAPersonnePromise(idPersonne, customBody)
		.then((updatePersonne) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(updatePersonne));
			res.end();
		})
		.catch((error) => console.log(error));
})

// NATIONALITIES
app.get('/nationalites', function(req, res) {
	selectAllNationalitesPromise
		.then((nationalities) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(nationalities));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.post('/nationalites', function(req, res) {
	insertNationalitePromise(customBody)
		.then((nationalite) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(nationalite));
			res.end();
		})
		.catch((error) => console.log(error));
})

// ROLES
app.get('/roles', function(req, res) {
	selectAllRolesPromise
		.then((roles) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(roles));
			res.end();
		})
		.catch((error) => console.log(error));
})

// TYPES
app.get('/types', function(req, res) {
	selectAllTypesPromise
		.then((genres) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(genres));
			res.end();
		})
		.catch((error) => console.log(error));
})

// STATS
app.get('/stats/vues', function(req, res) {
	selectStatsSeenMovies
		.then((stats) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(stats));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.post('/search/movies', function(req, res) {
	searchByWordsMoviesPromise(customBody)
		.then((result) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(result));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.post('/search/personnes', function(req, res) {
	searchByWordsPersonnesPromise(customBody)
		.then((result) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(result));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.get('/stats/actors/mostused', function(req, res) {
	selectMostUsedActorsPromise()
		.then((stats) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(stats));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.get('/stats/genres', function(req, res) {
	selectMostUsedGenresPromise
		.then((stats) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(stats));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.get('/stats/types', function(req, res) {
	selectMostUsedTypesPromise
		.then((stats) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(stats));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.listen(port, function () {
  console.log('App listening on port ' + port + '!');
  console.log('Address => http://localhost:' + port + '/');
})

// REQUETES
let selectAllFilmsPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
		`SELECT *, f.id_film
		FROM films as f
		LEFT JOIN film_genre as fg
			ON f.id_film = fg.id_film
		LEFT JOIN genres as g
			ON g.id_genre = fg.id_genre
		LEFT JOIN ddurs as d
			ON f.id_ddur = d.id_ddur
		LEFT JOIN types as t
			ON t.id_type = f.id_type
		ORDER BY f.titre`;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

function selectFilmByIdPromise(id) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
		`SELECT *, f.id_film
		FROM films as f
		LEFT JOIN film_genre as fg
			ON f.id_film = fg.id_film
		LEFT JOIN genres as g
			ON g.id_genre = fg.id_genre
		LEFT JOIN ddurs as d
			ON f.id_ddur = d.id_ddur
		LEFT JOIN types as t
			ON t.id_type = f.id_type
		WHERE f.id_film = ` + id + 
		` ORDER BY f.titre`;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
	});
}

function selectPersonnesMissingInfos(nbrPersonnes) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
		`SELECT * 
		FROM personnes 
		WHERE photo_profil IS NULL OR id_nationalite IS NULL OR date_naissance IS NULL 
		LIMIT ` + nbrPersonnes;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
	});
}

function selectFilmGenresPromise(idMovie) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
		`SELECT * 
		FROM film_genre as fg
		INNER JOIN genres as g
			ON fg.id_genre = g.id_genre
		WHERE id_film = ` + idMovie;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
	});
}

function selectNotJaquetteNotDatesMoviesPromise(nbrMovies) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
		`SELECT id_film, titre, jaquette, annee_sortie
		FROM films
		WHERE jaquette IS NULL OR annee_sortie IS NULL
		LIMIT ` + nbrMovies;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
	});
}

function searchByWordsMoviesPromise(words) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
		`SELECT id_film, titre, 'movies' as itemType 
		FROM films WHERE LOWER(titre) LIKE '%` + words + `%'`;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
	});
}

function searchByWordsPersonnesPromise(words) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
		`SELECT id_personne, prenom, nom, 'personnes' as itemType 
		FROM personnes WHERE LOWER(prenom) LIKE '%` + words + `%' OR LOWER(nom) LIKE '%` + words + `%'`;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
	});
}

function insertMovieGenresPromise(idMovie, genres) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var genreTable = [];

		genres.forEach(genre => {
			if (genre.isChecked) {
				genreTable.push([idMovie, genre.id_genre]);
			}
		})

		var selectQuery = 
		`DELETE FROM film_genre 
		WHERE id_film = ` + idMovie;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    selectQuery = 'INSERT INTO film_genre (id_film, id_genre) VALUES ?';

		    connection.query(
			  selectQuery,
			  [genreTable],
			  function select(error, results, fields) {
			    if (error) {
			      console.log(error);
			      connection.end();
			      reject("No Datas");
			    }

			    closeConnection(connection);

			    resolve(genreTable.length + " rows inserted");
			});
		});
	});
}

let selectAllFilmsWithTitlesPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'SELECT id_film, titre FROM films ORDER BY titre';

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

let selectStatsSeenMovies = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = `SELECT est_vu, COUNT(*) as count FROM films GROUP BY est_vu`;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

let selectMostUsedGenresPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
		`SELECT fg.id_genre, genre, COUNT(*) as count
			FROM film_genre as fg
			INNER JOIN genres as g
				ON fg.id_genre = g.id_genre
			GROUP BY fg.id_genre
			ORDER BY count DESC`;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

let selectMostUsedTypesPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
		`SELECT f.id_type, type, COUNT(*) as count
			FROM films as f
			INNER JOIN types as t
				ON t.id_type = f.id_type
			GROUP BY f.id_type
			ORDER BY count DESC`;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

let selectAllDDurPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'SELECT * FROM ddurs ORDER BY date_use DESC';

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

let selectAllPersonnesInFilmsPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
			`SELECT f.id_film, p.id_personne, prenom, nom, date_naissance, photo_profil, id_nationalite, r.id_role, role 
				FROM films as f
			    INNER JOIN film_personne as fp
			    	ON f.id_film = fp.id_film
			    INNER JOIN personnes as p
			    	ON fp.id_personne = p.id_personne
			    INNER JOIN roles as r
			    	ON r.id_role = fp.id_role`;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    var personnesByMovies = {};
		    var currentMovieId = 0;

		    closeConnection(connection);

		    results.forEach(element => {
		    	currentMovieId = element.id_film;
		    	if (personnesByMovies.hasOwnProperty(currentMovieId)) {
					personnesByMovies[currentMovieId].push(element);
		    	} else {
		    		personnesByMovies[currentMovieId] = [element];
		    	}
		    });

		    resolve(personnesByMovies);
		});
});

let selectAllGenresPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'SELECT * FROM genres ORDER BY genre ASC';

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

let selectAllTypesPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'SELECT * FROM types ORDER BY type ASC';

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

let selectAllRolesPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'SELECT * FROM roles ORDER BY role ASC';

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

let selectAllPersonnesPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
			`SELECT *, TRIM(CONCAT(prenom, ' ', nom)) as nomFinal FROM personnes as p 
			LEFT JOIN nationalites as n 
				ON n.id_nationalite = p.id_nationalite
			ORDER BY nomFinal ASC`;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

function selectPersonneByIdPromise(id) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
			`SELECT * FROM personnes as p 
			LEFT JOIN nationalites as n 
				ON n.id_nationalite = p.id_nationalite 
			WHERE p.id_personne = ` + id;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
	});
}

function selectMostUsedActorsPromise(id) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
			`SELECT *, COUNT(*) as count
			FROM film_personne as fp
			INNER JOIN personnes as p
				ON p.id_personne = fp.id_personne
			WHERE id_role = 1
			GROUP BY fp.id_personne
			ORDER BY count DESC
			LIMIT 15`;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
	});
}

function selectLastCreatedMoviesPromise(nbrMovies) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
		`SELECT id_film, titre, jaquette, d.id_ddur, ddur
			FROM films as f
		    INNER JOIN ddurs as d
		    	ON d.id_ddur = f.id_ddur
		    ORDER BY id_film DESC
		    LIMIT ` + nbrMovies;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
	});
}

function selectAllMoviesFromOnePersonne(id) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 
		`SELECT * FROM films as f
			INNER JOIN film_personne as fp
		    	ON f.id_film = fp.id_film
		    INNER JOIN roles as r
		    	ON r.id_role = fp.id_role
			WHERE fp.id_personne = ` + id;

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
	});
}

function selectMoviesWithoutGenres(nbrMovies) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var finalRequest = `
		SELECT f.id_film, titre, jaquette
		FROM films as f
		LEFT JOIN film_genre as fg
			ON f.id_film = fg.id_film
		WHERE fg.id_film IS NULL
		LIMIT ` + nbrMovies;

		connection.query(
		  finalRequest,
		  function (error, results) {
		    if (error) {
		      connection.end();
		      throw error;
		    }

		    closeConnection(connection);

		    resolve(results);
		});
	});
}

let selectAllNationalitesPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'SELECT * FROM nationalites ORDER BY nationalite ASC';

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

function insertMoviesPromise(movies) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();
		var moviesToInsert = [];
		var movieElement;

		var selectQuery = 'INSERT INTO films (titre, est_vu, extension, date_c, id_ddur, id_type) VALUES ?';

		movies.forEach(movie => {
			movieElement = [];

			movieElement[0] = movie.name;
			movieElement[1] = movie.seen;
			movieElement[2] = movie.extension;
			movieElement[3] = movie.date_c.toString();
			movieElement[4] = movie.ddur.toString();
			movieElement[5] = movie.type.toString();

			moviesToInsert.push(movieElement);
		});

		connection.query(
		  selectQuery,
		  [moviesToInsert],
		  function (error, results) {
		    if (error) {
		      connection.end();
		      throw error;
		    }

		    closeConnection(connection);

		    resolve({data : moviesToInsert.length + " rows inserted!!"});
		});
	});
}

function insertGenresToMoviesPromise(movies) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();
		var genresToInsertToMovies = [];
		var movieElement;

		var selectQuery = 'INSERT INTO film_genre (id_film, id_genre) VALUES ?';

		movies.forEach(movie => {
			movieElement = [];

			movieElement[0] = movie.id_film;
			movieElement[1] = movie.id_genre;

			genresToInsertToMovies.push(movieElement);
		});

		connection.query(
		  selectQuery,
		  [genresToInsertToMovies],
		  function (error, results) {
		    if (error) {
		      connection.end();
		      throw error;
		    }

		    closeConnection(connection);

		    resolve(movies);
		});
	});
}

function updateMoviesJaquetteDateCPromise(movies) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();
		var finalRequest = "";

		movies.forEach(movie => {
			var customRequest = `
				UPDATE films 
				SET jaquette = "` + movie.jaquette + `", 
				annee_sortie = "` + movie.annee_sortie + `" 
				WHERE id_film = ` + movie.id_film + `;`;

				finalRequest += customRequest;
		});

		connection.query(
		  finalRequest,
		  function (error, results) {
		    if (error) {
		      connection.end();
		      throw error;
		    }

		    closeConnection(connection);

		    resolve(movies);
		});
	});
}

function updateMoviePromise(movie) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();
		var movieKeys = Object.keys(movie);
		var requestValues = '';

		movieKeys.forEach(key => {
			if (!moviesColBlackList.includes(key)) {
				var movieValue = movie[key] ? movie[key].toString() : null;
				requestValues += key + ' = "' + movieValue + '", ';
			}
		});

		requestValues = requestValues.substring(0, requestValues.length-2);

		var selectQuery = "UPDATE films SET " + requestValues + " WHERE id_film = " + movie.id_film;

		connection.query(
		  selectQuery,
		  function (error, results) {
		    if (error) {
		      connection.end();
		      throw error;
		    }

		    closeConnection(connection);

		    resolve({data : "change done!!"});
		});
	});
}

function updateDdurPromise(ddur) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();
		var ddurKeys = Object.keys(ddur);
		var requestValues = '';

		ddurKeys.forEach(key => {
			var ddurValue = ddur[key] ? ddur[key].toString() : null;
			requestValues += key + " = '" + ddurValue + "', ";
		});

		requestValues = requestValues.substring(0, requestValues.length-2);

		var selectQuery = "UPDATE ddurs SET " + requestValues + " WHERE id_ddur = " + ddur.id_ddur;

		connection.query(
		  selectQuery,
		  function (error, results) {
		    if (error) {
		      connection.end();
		      throw error;
		    }

		    closeConnection(connection);

		    resolve({data : "change done!!"});
		});
	});
}

function updateGenrePromise(genre) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();
		var genreKeys = Object.keys(genre);
		var requestValues = '';

		genreKeys.forEach(key => {
			var genreValue = genre[key] ? genre[key].toString() : null;
			requestValues += key + " = '" + genreValue + "', ";
		});

		requestValues = requestValues.substring(0, requestValues.length-2);

		var selectQuery = "UPDATE genres SET " + requestValues + " WHERE id_genre = " + genre.id_genre;

		connection.query(
		  selectQuery,
		  function (error, results) {
		    if (error) {
		      connection.end();
		      throw error;
		    }

		    closeConnection(connection);

		    resolve({data : "change done!!"});
		});
	});
}

function updatePersonnePromise(personne) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();
		var personneKeys = Object.keys(personne);
		var requestValues = '';

		personneKeys.forEach(key => {
			if (!personnesColBlackList.includes(key)) {
				var personneValue = personne[key] ? personne[key].toString() : null;
				requestValues += key + " = '" + personneValue + "', ";
			}
		});

		requestValues = requestValues.substring(0, requestValues.length-2);

		var selectQuery = "UPDATE personnes SET " + requestValues + " WHERE id_personne = " + personne.id_personne;

		connection.query(
		  selectQuery,
		  function (error, results) {
		    if (error) {
		      connection.end();
		      throw error;
		    }

		    closeConnection(connection);

		    resolve({data : "change done!!"});
		});
	});
}

function insertNationalitePromise(nationalite) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'INSERT INTO nationalites (nationalite, code) VALUES ("' 
			+ nationalite.nationalite + '", "'
			+ nationalite.code + '")';

		connection.query(
		  selectQuery,
		  function (error, results) {
		    if (error) {
		      connection.end();
		      throw error;
		    }

		    nationalite.id_nationalite = results.insertId;

		    closeConnection(connection);

		    resolve(nationalite);
		});
	});
}

function insertPersonnePromise(personne) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'INSERT INTO personnes (prenom, nom, date_naissance, photo_profil, id_nationalite) VALUES ("' 
			+ personne.prenom + '", "'
			+ personne.nom + '", "'
			+ personne.date_naissance + '", "'
			+ personne.photo_profil + '", "'
			+ personne.id_nationalite + '")';

		connection.query(
		  selectQuery,
		  function (error, results) {
		    if (error) {
		      connection.end();
		      throw error;
		    }

		    personne.id_personne = results.insertId;

		    closeConnection(connection);

		    resolve(personne);
		});
	});
}

function insertMoviesToAPersonnePromise(idPersonne, movies) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();
		var moviesToInsert = [];
		var movieElement;

		var selectQuery = 'INSERT INTO film_personne (id_film, id_personne, id_role) VALUES ?';

		movies.forEach(movie => {
			movieElement = [];

			movieElement[0] = movie.id_film;
			movieElement[1] = idPersonne;
			movieElement[2] = movie.id_role;

			moviesToInsert.push(movieElement);
		});

		connection.query(
		  selectQuery,
		  [moviesToInsert],
		  function (error, results) {
		    if (error) {
		      connection.end();
		      throw error;
		    }

		    closeConnection(connection);

		    resolve({data : moviesToInsert.length + " rows inserted!!"});
		});
	});
}

function insertGenrePromise(genre) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'INSERT INTO genres (genre) VALUES ("' + genre.genre + '")';

		connection.query(
		  selectQuery,
		  function (error, results) {
		    if (error) {
		      connection.end();
		      throw error;
		    }

		    genre.id_genre = results.insertId;

		    closeConnection(connection);

		    resolve(genre);
		});
	});
}

function insertDdurPromise(ddur) {
	return new Promise((resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'INSERT INTO ddurs (ddur) VALUES ("' + ddur.ddur + '")';

		connection.query(
		  selectQuery,
		  function (error, results) {
		    if (error) {
		      connection.end();
		      throw error;
		    }

		    ddur.id_ddur = results.insertId;

		    closeConnection(connection);

		    resolve(ddur);
		});
	});
}

// AUTRES FONCTIONS
function createConnection() {
	var connection = mysql.createConnection({
	  host     : "localhost",
	  user     : "root",
	  password : "",
	  database : "films",
	  multipleStatements: true,
	});

	return connection;
}

function closeConnection(connection) {
	connection.end();
}