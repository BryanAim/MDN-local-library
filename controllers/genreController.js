var Genre = require('../models/genre');

//Display list of all Genres
exports.genre_list = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre list');
};

// Display Detail page for a specific genre
exports.genre_detail = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre detail: ' + req.params.id);
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