"use strict";

function model(req) {
  return req.app.locals.models.idol;
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
        action: "search",
        path: "search/:term"
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
      },
      {
        action: "viewByPageId",
        path: "page_id/:pageid"
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

  search: (req, res, next) => {
    if (req.params.term == undefined) {
      res.json([]);
    }

    const Op = req.app.locals.sequelize.Op;
    model(req)
      .findAll({
        where: {
          [Op.or]: [
            { firstname: { [Op.like]: "%"+req.params.term+"%" } },
            { lastname: { [Op.like]: "%"+req.params.term+"%" } }
          ]
        }
      })
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
  viewByPageId: (req, res, next) => {
    model(req)
      .find({
        where: {
          page_id: req.params.pageid
        }
      })
      .then(row => {
        row ? res.json(row) : res.status(404);
      })
      .catch(next);
  },
  create: (req, res, next) => {
    model(req)
      .create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        page_id: req.body.page_id,
        img_url: req.body.img_url
      })
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
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          page_id: req.body.page_id,
          img_url: req.body.img_url
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
