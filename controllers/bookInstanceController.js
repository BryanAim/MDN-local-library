var BookInstance = require('../models/bookinstance');

// Display list of all book instances
exports.bookinstance_list = function (req, res) {
  res.send('NOT IMPLEMENTED: Book instance list');
};

// Display detail page for a specific book instance 
exports.bookinstance_detail = function (req, res) {
  res.send('NOT IMPLEMENTED: Book instance detail: ' + req.params.id);
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