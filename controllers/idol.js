'use strict';

function model(req)
{
  return req.app.locals.models.idol;
}

module.exports = {
  __exprest: {
    routes: [{
      action: 'list'
    }, {
      action: 'view'
    , path: ':id'
    }, {
      action: 'create'
    , method: 'post'
    }, {
      action: 'update'
    , path: ':id'
    , method: 'put'
    }, {
      action: 'remove'
    , path: ':id'
    , method: 'delete'
    }]
  }

, list: (req, res, next) => {
    model(req).findAll()
    .then((rows) => {console.log(rows); res.json(rows); });
  }

, view: (req, res, next) => {
    model(req).findById(req.params.id)
    .then((row) => { row ? res.json(row) : res.status(404); })
    .catch(next);
  }

, create: (req, res, next) => {
    model(req).create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      page_id: req.body.page_id,
      img_url: req.body.img_url,
    })
    .then((row) => { res.json(row); })
  }

, update: (req, res, next) => {
    model(req).findById(req.params.id)
    .then((row) => {
      if (!row) {
        res.status(404);
        return Promise.resolve();
      }
      return row.update({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        page_id: req.body.page_id,
        img_url: req.body.img_url,
      });
    })
    .then(() => { res.end(); })
    .catch(next);
  }

, remove: (req, res, next) => {
    model(req).findById(req.params.id)
    .then((row) => row ? row.destroy() : Promise.resolve())
    .then(() => { res.end(); })
    .catch(next);
  }
};
