// TODO
// Note: The appearance of the author lifespan dates is ugly! You can improve this using the same approach as we used for the BookInstance list (adding the virtual property for the lifespan to the Author model). This time, however, there are missing dates, and references to nonexistent properties are ignored unless strict mode is in effect. moment() returns the current time, and you don't want missing dates to be formatted as if they were today. One way to deal with this is to define the body of the function that returns a formatted date so it returns a blank string unless the date actually exists. For example:

// return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';


var Author = require('../models/author');

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