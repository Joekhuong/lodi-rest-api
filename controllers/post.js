"use strict";

function model(req) {
  return req.app.locals.models.post;
}

module.exports = {
  __exprest: {
    routes: [
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
      },
      {
        action: "viewByPageId",
        path: "page_id/:pageid"
      },
      {
        action: "viewByParentId",
        path: "parent_id/:parentid"
      },
      {
        action: "viewByUserId",
        path: "user_id/:userid"
      }
    ]
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

  viewByUserId: (req, res, next) => {
    model(req)
      .find({
        where: {
          user_id: req.params.userid
        }
      })
      .then(row => {
        row ? res.json(row) : res.status(404);
      })
      .catch(next);
  },

  viewByParentId: (req, res, next) => {
    model(req)
      .find({
        where: {
          parent_id: req.params.parentid
        }
      })
      .then(row => {
        row ? res.json(row) : res.status(404);
      })
      .catch(next);
  },

  create: (req, res, next) => {

    let user_id = req.params.user_id || null;

    if(user_id == null)
    {
      res.status(404);
      return;
    }

    let content = req.params.content || null;

    if(content == null)
    {
      res.status(404);
      return;
    }

    let page_id = req.params.pageid || null;
    let parent_id = req.params.pageid || null;

    model(req)
      .create({
        user_id: user_id,
        content: content,
        page_id: page_id,
        parent_id: parent_id
      })
      .then(row => {
        res.json(row);
      });
  },

  update: (req, res, next) => {

    let content = req.params.content || null;

    if(content == null)
    {
      res.status(404);
      return;
    }

    model(req)
      .findById(req.params.id)
      .then(row => {
        if (!row) {
          res.status(404);
        }
        return row.update({
          content:content
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
