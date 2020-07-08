var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
const { body, validationResult, sanitizeBody } = require('express-validator');
const author = require('../models/author');

// Display list of all book instances
exports.bookinstance_list = function (req, res, next) {
  BookInstance.find()
  .populate('book')
  .exec(function (err, list_bookinstances) {
    if (err) {
      return next(err);
    }
    //Successful, so render
    res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances});
  })
};

// Display detail page for a specific book instance 
exports.bookinstance_detail = function (req, res, next) {
  // The method calls BookInstance.findById() with the ID of a specific book instance extracted from the URL (using the route), and accessed within the controller via the request parameters: req.params.id). It then calls populate() to get the details of the associated Book.
  BookInstance.findById(req.params.id)
  .populate('book')
  .exec(function (err, bookinstance) {
    if (err) { return next(err); }
    if (bookinstance==null) {
      //No results
      var err = new Error('Book copy not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render
    res.render('bookinstance_detail', { title: 'Book', bookinstance: bookinstance})
  })
  
};

// Display BookInstance create form on GET
exports.bookinstance_create_get = function (req, res, next) {
  Book.find({}, 'title')
  .exec(function (err, books) {
    if (err) {
      return next(err);
    }
    //Successful, so render
    res.render('bookinstance_form', {title: 'Create Bookinstance', book_list: books})
  })
};

// Handle BookInstance create form on POST
exports.bookinstance_create_post = [

  //Validate fields
  body('book', 'Book must be specified')
  .trim()
  .isLength({ min: 1}),

  body('imprint', 'Imprint must be specified')
  .trim()
  .isLength({min:1}),

  body('due_back', 'Invalid date')
  .optional({checkFalsy: true})
  .isISO8601(),

  // Sanitize fields
  sanitizeBody('book').escape(),
  sanitizeBody('imprint').escape(),
  sanitizeBody('status').trim().escape(),
  sanitizeBody('due_back').toDate(),

  //Process request after validation and sanitization
  (req, res, next) => {

    //Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data
    var bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });

  if (!errors.isEmpty()) {
    //There are errors. Render form again with sanitized values/ error messages
    Book.find({}, 'title')
    .exec(function(err, books) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance });
    });
    return
  } else {
    //Data from form is valid
    bookinstance.save(function (err) {
      if (err) {
        return next(err);
      }
      //Successful -redirect to new record
      res.redirect(bookinstance.url);
    });
  }
  }
]

// Display BookInstance delete form on GET
exports.bookinstance_delete_get = function (req, res, next) {
  
  BookInstance.findById(req.params.id)
  .populate('book')
  .exec(function (err, bookinstance) {
    if (err) {return next(err); }

    if (bookinstance==null) {
      //No results
      res.redirect('/catalog/bookinstances');
    }
    // Successful so render
    res.render('bookinstance_delete', {title: 'Delete Bookinstance', bookinstance: bookinstance })
  })
};

// Display BookInstance delete form on POST
exports.bookinstance_delete_post = function (req, res, next) {
  BookInstance.findByIdAndRemove(req.body.id, function deleteBookinstance(err) {
    if (err) {
      return next(err);
    }
    //Success, redirect to list of bookinstances
    res.redirect('/catalog/bookinstances')
  })
};

// Display BookInstance update form on GET
exports.bookinstance_update_get = function (req, res, next) {
  
  // GEt book, authors and genres for form
  async.parallel({
    book: function (callback) {
      Book.findById(req.params.id)
      .populate('author')
      .populate('genre')
      .exec(callback);
    },
    authors: function (callback) {
      Author.find(callback)
    },
    genres: function (callback) {
      Genre.find(callback);
    },
  }, function (err, results) {
    if (err) { return next(err) }
    if (results.book==null) {
      //No results
      var err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }
    //Success
    //Mark selected genres as checked
    for (let all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
      for (let book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {
        if (results.genres[all_g_iter]._id.toString()==results.book.genre[book_g_iter]._id.toString()) {
          results.genres[all_g_iter].checked='true'
        }
        
      };
      
    }
    res.render('book_form', { title: 'Update book', authors: results.authors, genres: results.genres, book: results.book })
  })
};

// Handle BookInstance update on POST
exports.bookinstance_update_post = [

  //Convert the genre to an array
  (req, res, next)=> {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre=='undefined') {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  // Validate fields
  body('title', 'Title must not be empty').isLength({ min: 1}).trim(),
  body('author', 'Author must not be empty.').isLength({ min: 1}).trim(),
  body('summary', 'summary must not be empty').isLength({ min: 1}).trim(),
  body('isbn', 'ISBN must not be empty.').isLength({ min: 1}).trim(),

  //sanitize fields
  sanitizeBody('title').escape(),
  sanitizeBody('author').escape(),
  sanitizeBody('summary').escape(),
  sanitizeBody('isbn').escape(),
  sanitizeBody('genre.*').escape(),
  
  // Process request after validation and sanitization
  (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req)

    //Create a book object with escaped/ trimmed data

    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: (typeof req.body.genre=='undefined') ? [] : req.body.genre,
      _id: req.params.id //REQUIRED , or a new ID wii be assigned
    });

    if (!errors.isEmpty()) {
      //No errors, render form again with sanitized values/ error messages

      //get all authors and genres for form
      async.parallel({
        authors: function(callback) {
          Author.find(callback)
        },
        genres: function (callback) {
          Genre.find(callback);
        },
      }, function (err, results) {
        if (err) { return next(err) }

        //Mark our selected genres as checkedbundleRenderer.renderToStream
        for (let i = 0; i < results.genres.length; i++) {
          if (book.genre.indexOf(results.genres[i]._id) > -1) {
            results.genres[i].checked='true';
          }
          
        }
        res.render('book_form', { title: 'Update book', authors: results.authors, genres: results.genres, book: book, errors: errors.array()})
      });
      return;
    } else {
      //Data from form is valid. Update the record
      Book.findByIdAndUpdate(req.params.id, book, {}, function (err, thebook) {
        if (err) { return next(err) 
        }
        //Successful - redirect to book detail page
        res.redirect(thebook.url);
      })
    }
  }
]