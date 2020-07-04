var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
const validator = require('express-validator');

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
exports.genre_create_get = function (req, res, next) {
  res.render('genre_form', {title: 'Create Genre'});
};

//Handle Genre create on POST
exports.genre_create_post = [
  // Handle Genre create on POST.

  // check that the name field is not empty (calling trim() to remove any trailing/leading whitespace before performing the validation)
  validator.body('name', 'Genre name required').trim().isLength({min: 1}),

  //Sanitize(escape) the name field

  // creates a sanitizer to escape() any dangerous  HTML characters in the name field.
  validator.sanitizeBody('name').escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    
    // Extract the validation errors from a request
    const errors = validator.validationResult(req);

    // Create a genre object with escaped and trimmed data

    var genre = new Genre(
      { name: req.body.name }
    );

    // We use isEmpty() to check whether there are any errors in the validation result
    if (!errors.isEmpty()) {

      //There are no errors.Render the form again with sanitized values/error messages.
      res.render('genre_form', {title: 'Create Genre', genre: genre, errors: errors.array()});
      return;
    } else {

      //Data from form is valid.
      //Check if genre with same name already exists
      Genre.findOne({'name': req.body.name })
      .exec(function (err, found_genre) {
        if (err) { return next(err); }
        if (found_genre) {
          
          //Genre exists, redirect to its detail page
          res.redirect(found_genre.url);
        } else {
          genre.save(function (err) {
            if (err) { return next(err); }
            //Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);

          });
        }
      });
      
    }
  }
]

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