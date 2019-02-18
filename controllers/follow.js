"use strict";

function model(req) {
  return req.app.locals.models.follow;
}

module.exports = {
  __exprest: {
    routes: [
      {
        action: "follow",
        path: "follows_idol",
        method: "post"
      },
      {
        action: "unfollow",
        path: "unfollows_idol",
        method: "post"
      },
      {
        action: "getForUser",
        path: "user_id/:userid",
        method: "post"
      },
      {
        action: "hasFollowed",
        path: "check_follow/:userid/:idolid"
      },
    ]
  },

  unfollow: (req, res, next) => {

    model(req).destroy({
       where: {
          user_id: req.params.user_id,
          idol_id: req.params.idol_id
       }
    }).then(rowDeleted => {
      res.json({status:true});
    })
    .catch(() => res.status(404));
  },

  follow: (req, res, next) => {
    console.log(req.params);
    model(req)
      .create({
        user_id: req.params.user_id,
        idol_id: req.params.idol_id
      })
      .then(row => {
        console.log(row);
        res.json({status:true});
      })
      .catch((err) => res.json({status:false,err}));
  },

  hasFollowed: (req, res, next) => {

    const Op = req.app.locals.sequelize.Op;

    model(req).find({
       where: {
          [Op.and]: [
            { user_id: req.params.userid },
            { idol_id: req.params.idolid }
          ]
       }
    })
    .then(row => {

      if(row == null) res.json({status:false});
      console.log(row);
      row.length > 0 ? res.json({status:true}) : res.json({status:false});
    })
    .catch(() => (res.status(404)));
  },

  getForUser: (req, res, next) => {

    model(req).find({
       where: {
          user_id: req.params.userid
       }
    })
    .then(row => {
      row.length > 0 ? res.json({status:true}) : res.status(404);
    })
    .catch(next);
  },
};
