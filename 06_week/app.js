const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

const LOLCharacterRouter = require('./router/LOLCharacterRouter');
app.use(LOLCharacterRouter);

module.exports = app;
