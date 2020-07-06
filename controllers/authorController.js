// TODO
// Note: The appearance of the author lifespan dates is ugly! You can improve this using the same approach as we used for the BookInstance list (adding the virtual property for the lifespan to the Author model). This time, however, there are missing dates, and references to nonexistent properties are ignored unless strict mode is in effect. moment() returns the current time, and you don't want missing dates to be formatted as if they were today. One way to deal with this is to define the body of the function that returns a formatted date so it returns a blank string unless the date actually exists. For example:

// return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';

var Author = require('../models/author');
var Book = require('../models/book');
var async = require('async');
const { body, validationResult, sanitizeBody } = require('express-validator');


// Display list of all Authors

exports.author_list = function(req, res, next) {
  Author.find()
  .populate('author')
  .sort([['last_name', 'ascending']])
  .exec(function (err, list_authors) {
    if(err) { return next(err); }
    //Successful, so render
    res.render('author_list', { title: 'Author List', author_list: list_authors});
  });
};

//Display detail page for a specific author
exports.author_detail = function (req, res, next) {
  async.parallel({
    author: function (callback) {
      Author.findById(req.params.id)
      .exec(callback);
    },
    authors_books: function(callback) {
      Book.find({ 'author': req.params.id }, 'title summary')
      .exec(callback);
    }
  }, function (err, results) {
    if (err) { return next(err); }// Error in API usage.
    if (results.author==null) {//No results
      var err = new Error("Author not found");
      err.status = 404;
      return next(err);
    }
    // Successful, so render
    res.render('author_detail', {title: 'Author Detail', author: results.author, author_books: results.authors_books } );
  })
}

// Display Author Create form on GET
exports.author_create_get = function (req, res, next) {
  res.render('author_form', {title: 'Create Author'});
};

// Handle Author create on POST
exports.author_create_post = [
  
  // Validate fields
  body('first_name')
  .isLength({ min: 1})
  .trim()
  .withMessage('First Name must be specified')
  .isAlphanumeric()
  .withMessage('First name has non-alphanumeric characters'),

  body('last_name')
  .isLength({ min: 1 })
  .trim()
  .withMessage('Last name must be specified')
  .isAlphanumeric()
  .withMessage('Last name has non-alphanumeric characters'),

  // the checkFalsy flag means that we'll accept either an empty string or null as an empty value
  body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),

  // use optional() function to run a subsequent validation only if a field has been entered (this allows us to validate optional fields)
  body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fields
  sanitizeBody('first_name').escape(),
  sanitizeBody('last_name').escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request
    const errors= validationResult(req);
    if (!errors.isEmpty()) {
      // There are no errors. Render again with sanitized values/ error messages
      res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
      return;
    } else {
      // Data from form is valid
      
      // Create author object with escaped and trimmed data
      var author = new Author(
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          date_of_birth: req.body.date_of_birth,
          date_of_death: req.body.date_of_death
        });
        author.save(function(err) {
          if (err) {
            return next(err);
          }
          //Successful - redirect to new author record
          res.redirect(author.url);
        })

    }
    
  }

]

// Display Author delete form on GET
exports.author_delete_get = function (req, res, next) {
  
  async.parallel({
    author: function(callback) {
      Author.findById(req.params.id).exec(callback)
    },
    authors_books: function (callback) {
      Book.find({'author': req.params.id }).exec(callback)
    },
  }, function (err, results) {
    if (err) {
      return next(err)
    }
    if (results.author==null) {
      //No results
      res.redirect('/catalog/authors');
    }
    //Successful, so render
    re.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authord_books });
  });
};


// Handle Author delete on POST
exports.author_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author delete post');
};

//Display Author update form on GET
exports.author_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update get');
};


// Handle Author update on POST
exports.author_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update post');
};