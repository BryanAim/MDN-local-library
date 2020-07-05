var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require('async');

const{ body, validationResult, sanitizeBody } = require('express-validator');

exports.index = function (req, res) {
  // The async.parallel() method is passed an object with functions for getting the counts for each of our models. These functions are all started at the same time. When all of them have completed the final callback is invoked with the counts in the results parameter (or an error).
  async.parallel({
    book_count: function (callback) {
      // We use the countDocuments() method to get the number of instances of each model. This is called on a model with an optional set of conditions to match against in the first argument and a callback in the second argument
      Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
    },
    book_instance_count: function (callback) {
      BookInstance.countDocuments({}, callback);
    },
    book_instance_available_count: function (callback) {
      BookInstance.countDocuments({status: 'Available'}, callback);
    },
    author_count: function(callback) {
      Author.countDocuments({}, callback);
    },
    genre_count: function (callback) {
      Genre.countDocuments({}, callback);
    }
    // On success the callback function calls res.render(), specifying a view (template) named 'index' and an object containing the data that is to be inserted into it (this includes the results object that contains our model counts). The data is supplied as key-value pairs, and can be accessed in the template using the key.
  }, function (err, results) {
    res.render('index', {title: 'Local Library Home', error: err, data: results});
  });
  
}

// Display list of all books
exports.book_list = function (req, res, next) {
  Book.find({}, 'title author')
  .populate('author')
  .exec(function (err, list_books) {
    if (err) {
      return next(err);
    }
    // Successful, so render
    res.render('book_list', { title: 'Book List', book_list: list_books });
  });
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {
  async.parallel({
    book: function (callback) {
      Book.findById(req.params.id)
      .populate('author')
      .populate('genre')
      .exec(callback);
    },
    book_instance: function (callback) {
      BookInstance.find({ 'book': req.params.id })
      .exec(callback);
    },

  }, function (err, results) {
    if (err) { return next(err); }
    if (results.book==null) {
      //No results
      var err = new Error('Book not Found');
      err.status = 404;
      return next(err);
    }
    // Successful so render
    res.render('book_detail', {title: results.book.title, book: results.book, book_instances: results.book_instance } );
  });
};

// Display book create form on GET.
exports.book_create_get = function(req, res, next) {

  // Get all authors and genres, which we can use for adding to our book
  async.parallel({
    authors: function(callback) {
      Author.find(callback);
    },
    genres: function (callback) {
      Genre.find(callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
  });
}

// Handle book create on POST.
exports.book_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update POST');
};