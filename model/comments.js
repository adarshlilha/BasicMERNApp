'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CommentsSchema = new Schema({
	author : String,
	text : String
});

module.exports = mongoose.model('Comment',CommentsSchema);