'use strict';

const express = require('express')
    , exprest = require('exprest4')
    , app = express()
    , bodyParser = require('body-parser')
    , cors = require('cors');
;

app.use(cors());
app.use(express.static(__dirname, { dotfiles: 'allow' } ));

// support parsing of application/json type post data
app.use(bodyParser.json());

exprest.route(app, { url: '/api' })
.then(() => exprest.model({ dialect: 'sqlite', storage: './lodi.sqlite', })) // Use SQLite with memory storage
.then((sequelize) => {
  app.locals.models = sequelize.models; // Save the models for controllers
  app.locals.sequelize = sequelize;
  return sequelize.sync();
})
.then(() => {
  app.listen(3333);
});
