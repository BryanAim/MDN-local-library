var BookInstance = require('../models/bookinstance');

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
exports.bookinstance_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Book instance create get');
};

// Display BookInstance create form on POST
exports.bookinstance_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Book instance create post');
};

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