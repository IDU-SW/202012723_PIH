const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

const LOLCharacterRouter = require('./router/LOLCharacterRouter');
app.use(LOLCharacterRouter);

app.use(express.static("uploads"));

module.exports = app;
