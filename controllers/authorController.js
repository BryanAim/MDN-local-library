var Author = require('../models/author');

// Display list of all Authors

exports.author_list = function(req, res) {
  res.send('NOT IMPLEMENTED:Author list')
};

//Display detail page for a specific author
exports.author_detail = function (req, res) {
  res.send('NOT IMPLEMENTED: Author Detail: ' + req.params.id);
}

// Displau Author Create form on GET
exports.author_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST
exports.author_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author create post');
};

// Display Author delete on GET
exports.author_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author delete get');
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