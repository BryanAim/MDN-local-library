var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      maxlength: 100
    },
    last_name: {
      type: String,
      required: true,
      maxlength: 100
    },
    date_of_birth: {type: Date},
    date_of_death: {type: Date}
  }
);

// Virtual for author's full name
AuthorSchema.virtual('name')
.get(function () {
  // To avoid errors in cases where an author does not have either a lastname or first name
// We want to make sure we handle the exception by returning an empty string for that case

var fullname = '';
if (this.first_name && this.last_name) {
  fullname = this.first_name + ', ' + this.last_name
}
if (!this.first_name || !this.last_name) {
  fullname = '';
}
return fullname;
});

// Virtual for author's lifespan

AuthorSchema.virtual('lifespan')
.get(function () {
  return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
});

// Virtual for author's URL

AuthorSchema.virtual('url')
.get(function () {
  return '/catalog/author/' + this.id;
});
//Export Model
module.exports = mongoose.model('Author', AuthorSchema);