"use strict";

function model(req) {
  return req.app.locals.models.user;
}

module.exports = {
  __exprest: {
    routes: [
      {
        action: "list"
      },
      {
        action: "view",
        path: ":id"
      },
      {
        action: "create",
        method: "post"
      },
      {
        action: "update",
        path: ":id",
        method: "put"
      },
      {
        action: "remove",
        path: ":id",
        method: "delete"
      }
    ]
  },

  list: (req, res, next) => {
    model(req)
      .findAll()
      .then(rows => {
        console.log(rows);
        res.json(rows);
      });
  },

  view: (req, res, next) => {
    model(req)
      .findById(req.params.id)
      .then(row => {
        row ? res.json(row) : res.status(404);
      })
      .catch(next);
  },


  create: (req, res, next) => {
    console.log(req.body);
    model(req)
      .create(req.body)
      .then(row => {
        res.json(row);
      });
  },

  update: (req, res, next) => {
    model(req)
      .findById(req.params.id)
      .then(row => {
        if (!row) {
          res.status(404);
          return Promise.resolve();
        }
        return row.update({
          title: req.body.title,
          description: req.body.description
        });
      })
      .then(() => {
        res.end();
      })
      .catch(next);
  },

  remove: (req, res, next) => {
    model(req)
      .findById(req.params.id)
      .then(row => (row ? row.destroy() : Promise.resolve()))
      .then(() => {
        res.end();
      })
      .catch(next);
  }
};
