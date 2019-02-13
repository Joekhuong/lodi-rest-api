"use strict";

function model(req) {
  return req.app.locals.models.follow;
}

module.exports = {
  __exprest: {
    routes: [
      {
        action: "follow",
        method: "post"
      },
      {
        action: "unfollow",
        method: "post"
      }
    ]
  },

  unfollow: (req, res, next) => {

    model(req).destroy({
       where: {
          user_id: req.body.user_id,
          idol_id: req.body.idol_id
       }
    }).then(rowDeleted => {
      res.json({status:true});
    })
    .catch(() => res.status(404));
  },

  follow: (req, res, next) => {
    model(req)
      .create({
        user_id: req.body.user_id,
        idol_id: req.body.idol_id
      })
      .then(row => {
        res.json(row);
      })
      .catch(() => res.status(404));;
  },

  hasFollowed: (req, res, next) => {

    model(req).find({
       where: {
          user_id: req.body.user_id,
          idol_id: req.body.idol_id
       }
    })
    .then(row => {
      row.length > 0 ? res.json({status:true}) : res.status(404);
    })
    .catch(next);
  },
};
