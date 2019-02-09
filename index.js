'use strict';

const express = require('express')
    , exprest = require('exprest4')
    , app = express()
    , bodyParser = require('body-parser')
    , cors = require('cors');
;

app.use(cors());

// support parsing of application/json type post data
app.use(bodyParser.json());

exprest.route(app, { url: '/api' })
.then(() => exprest.model({ dialect: 'sqlite', storage: './lodi.sqlite', })) // Use SQLite with memory storage
.then((sequelize) => {
  app.locals.models = sequelize.models; // Save the models for controllers
  return sequelize.sync();
})
.then(() => {
  app.listen(3333);
});
