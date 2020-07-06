var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
const { body, validationResult, sanitizeBody } = require('express-validator');

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
exports.bookinstance_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Book instance delete get');
};

// Display BookInstance delete form on POST
exports.bookinstance_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Book instance delete post');
};

// Display BookInstance update form on GET
exports.bookinstance_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Book instance update get');
};

// Display BookInstance update on POST
exports.bookinstance_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Book instance update post');
};