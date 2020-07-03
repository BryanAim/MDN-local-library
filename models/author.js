var mongoose = require('mongoose');
const moment = require('moment');
const { auto } = require('async');

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

//Virtual for moment's date formatting
AuthorSchema
.virtual('lifespan')
.get(function() {
  var lifetime_string = '';
  if (this.date_of_birth) {
    lifetime_string = moment(this.date_of_birth).format('MMMM Do, YYYY');
  }
  lifetime_string += ' - ';
  if (this.date_of_death) {
    lifetime_string = moment(this.date_of_death).format('MMMM Do, YYYY')
  }
  return lifetime_string;
});

AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function() {
  return moment(this.date_of_birth).format('YYYY-MM-DD');
});

AuthorSchema
.virtual('date_of_death_yyyy_mm_dd').get(function () {
  return moment(this.date_of_death).format('YYYY-MM-DD');
});

//Export Model
module.exports = mongoose.model('Author', AuthorSchema);