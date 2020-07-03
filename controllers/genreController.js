var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');

//Display list of all Genres
exports.genre_list = function (req, res, next) {
  Genre.find()
  .populate('genre')
  .sort([['name', 'ascending']])
  .exec(function (err, list_genres) {
    if (err) {return next(err);}
    //Successful, so render
    res.render('genre_list', {title: 'Genre List',  genre_list: list_genres});
  });
};

// Display Detail page for a specific genre
exports.genre_detail = function (req, res, next) {
 async.parallel({
   genre: function(callback) {
     Genre.findById(req.params.id)
     .exec(callback);
   },
   genre_books: function (callback) {
     Book.find({ 'genre': req.params.id})
     .exec(callback);
   },
 }, function(err, results) {
  if (err) { return next(err); }
  if (results.genre==null) {
    //No results
    var err = new Error('Genre not found');
    err.status = 404;
    return next(err);
  }
  // Successful, so render
  res.render('genre_detail', {title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books} );
 });
};

//Display Genre create form on GET
exports.genre_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre create get');
};

//Handle Genre create on POST
exports.genre_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre create post');
};

//Display Genre delete form on get
exports.genre_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre delete get');
};

//Handle Genre delete form on POST
exports.genre_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

//Display Genre update form on get
exports.genre_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update get');
};

//Display Genre update form on POST
exports.genre_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};