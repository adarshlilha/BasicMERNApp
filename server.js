'use strict'
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let Comment = require('./model/comments');

let app = express();

let port = 3001;
mongoose.connect('mongodb://test:12345@ds129926.mlab.com:29926/mernapp')
let router = express.Router();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
	res.setHeader('Cache-Control', 'no-cache');
	next();
});

router.get('/',(req,res) => {
	res.json({ message: 'API Initialized!'});
});

router.route('/comments')
.get((req,res) => {
	Comment.find((err,comments) => {
		if (err) {
			res.send(err);
		}
		res.json(comments);
	});
}).post((req,res) => {
	let comment = new Comment();
	comment.author = req.body.author;
	comment.text = req.body.text;

	comment.save((err) => {
		if (err){
			res.send(err);
			res.json({message : 'Comment Added successfully!'});
		}
	});
});

router.route('/comments/:comment_id')
.put((req,res) => {
	Comment.findById(req.params.comment_id, (err,comment) => {
		if (err){
			res.send(err);
		}
		(req.body.author) ? comment.author = req.body.author : null;
		(req.body.text) ? comment.text = req.body.text : null;

		comment.save((err) => {
			if (err)
				res.send(err);
			res.json({message : 'Comment Updated'});
		});
	});
}).delete((req,res) => {
	Comment.remove({_id : req.params.comment_id}, (err,comment) => {
		if (err)
			res.send(err);
		res.json({message : 'Comment deleted'});
	})
});

app.use('/api',router);

app.listen(port, function(){
	console.log(`api running on port ${port}`);
});