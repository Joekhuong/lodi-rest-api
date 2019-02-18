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
      .findByPk(req.params.id)
      .then(row => {
        console.log(row);
        row ? res.json(row) : res.json(null);
      })
      .catch(next);
  },

  viewByPageId: (req, res, next) => {

    let sql = `SELECT p.*, i.firstname||i.lastname AS idol_name , u.firstname||u.lastname AS user_name FROM posts AS p
    LEFT JOIN users AS u ON p.created_by = u.id
    LEFT JOIN idols AS i ON p.page_id = i.page_id
    WHERE page_id='${req.params.pageid}'`;

    req.app.locals.sequelize
    .query(sql, { type: req.app.locals.sequelize.QueryTypes.SELECT})
    .then(row => {
      res.json(row);
    }).catch(next);

    // model(req)
    //   .findAll({
    //     where: {
    //       page_id: req.params.pageid
    //     }
    //   })
    //   .then(row => {
    //     if(row.length == 0)
    //     {
    //       res.json([]);
    //       return;
    //     }
    //
    //
    //
    //     row ? res.json(row) : res.status(404);
    //   })
    //   .catch(next);
  },

  viewByUserId: (req, res, next) => {

    let sql = `SELECT p.*, i.firstname||i.lastname AS idol_name , u.firstname||u.lastname AS user_name FROM posts AS p
    LEFT JOIN users AS u ON p.created_by = u.id
    LEFT JOIN idols AS i ON p.page_id = i.page_id
    WHERE created_by='${req.params.userid}'`;

    req.app.locals.sequelize
    .query(sql, { type: req.app.locals.sequelize.QueryTypes.SELECT})
    .then(row => {
      res.json(row);
    }).catch(next);

    // model(req)
    //   .find({
    //     where: {
    //       user_id: req.params.userid
    //     }
    //   })
    //   .then(row => {
    //     row ? res.json(row) : res.status(404);
    //   })
    //   .catch(next);
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

    let user_id = req.body.user_id || null;

    if(user_id == null)
    {
      res.json({status:false});
      return;
    }

    let content = req.body.content || null;

    if(content == null)
    {
      res.json({status:false});
      return;
    }

    let page_id = req.body.page_id || null;
    let parent_id = req.body.parent_id || null;

    model(req)
      .create({
        created_by: user_id,
        content: content,
        page_id: page_id,
        parent_id: parent_id
      })
      .then(row => {
        res.json(row);
      })
      .catch(() => res.json({status:false}));
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
