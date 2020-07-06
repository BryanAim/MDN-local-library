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
exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre==='undefined') {
        req.body.genre=[];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },
  // Validate fields
  body('title', 'Title must not be empty').trim().isLength({ min: 1}),
  body('Author', 'Author must not be empty.').trim().isLength({ min: 1 }),
  body('Summary', 'Summary must not be empty.').trim().isLength({ min: 1}),
  body('ISBN', 'ISBN must not be empty').trim().isLength({ min: 1}),

  // Sanitize fields (using wildcard)
  sanitizeBody('*').escape(),

  // Process request after validation and sanitization
  (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // create a book object with escaped and trimmed data.
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre
    });

    if (!errors.isEmpty()) {
      //There are no errors, render again with sanitized values/ error messages.

      //Get all authors and genres for form
      async.parallel({
        authors: function(callback) {
          Author.find(callback);
        },
        genres: function (callback) {
          Genre.find(callback);
        }
      }, function (err, results) {
        if (err) {
          return next(err);
        }
        //Mark our selected genres as checked
        for (let i = 0; i < results.genres.length; i++) {
          if (book.genre.indexOf(results.genres[i]._id) > -1) {
            // Current genre is selected. Set "checked" flag.
            results.genres[i].checked='true';
          } 
        }
        res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
      });
      return;
    } else {
      // Data from form is valid. Save book.
      book.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful-redirect to new book record.
        res.redirect(book.url);
      })
    }
  }
]

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res, next) {
  
  //Get book, authors and genres for form
  async.parallel({
    book: function(callback) {
      Book.findById(req.params.id)
      .populate('author')
      .populate('genre')
      .exec(callback)
    },
    authors: function(callback) {
      Author.find(callback);
    },
    genres: function (callback) {
      Genre.find(callback);
    },
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    if (results.book==null) {
      //No results
      var err = new Error('Book not found');
      err.status=404;
      return next(err);
    }
    // Success.
    //Mark our selected genres as checked.
    for (let allGenreIteration = 0; allGenreIteration < results.genre.length; allGenreIteration++) {
      for(let bookGenreIteration = 0; allGenreIteration < results.book.genre.length; bookGenreIteration++) {
      if (results.genres[allGenreIteration]._id.toString()==results.book.genre[bookGenreIteration]._id.toString()) {
        results.genres[allGenreIteration].checked='true'
      }
    }    
  }
  res.render('book_form', { title: 'Update Book', authors: results.authors, genres: results.genres, book: results.book });
  });
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update POST');
};