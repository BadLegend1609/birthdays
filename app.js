/** @format */

//initializing the app//

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const Schema = mongoose.Schema;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

/////setting up the db///////

const password = process.env.PASSWORD;

mongoose.connect(
	`mongodb+srv://admin-pratik:${password}@cluster0.4xp3o.mongodb.net/birthday?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('Mongoose Connected');
});
//////Schema/////////
const birthdaySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	birthday: {
		type: Date,
		required: true,
	},
});
const Birthday = mongoose.model('Birthday', birthdaySchema);
const today = new Date();
///////Routes///////////
app.get('/', function (req, res) {
	Birthday.find({}, (err, birthdays) => {
		res.render('list', {
			birthday: birthdays,
		});
	});
});

app.get('/add', (req, res) => {
	res.render('add');
});
app.post('/add', (req, res) => {
	let name = req.body.name;
	let age = req.body.age;
	let date = req.body.date;
	let newDate = new Birthday({
		name: name,
		age: age,
		birthday: date,
	});
	newDate.save();
	res.redirect('/');
});
//////////port listening/////////
let port = process.env.PORT;
if (port == null || port == '') {
	port = 3000;
}
app.listen(port, function (err) {
	err ? console.log(err) : console.log(`Server started in port ${port}`);
});
