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
        path: "user_id/:userid"
      },
      {
        action: "getRankingForRegion",
        path: "ranking/:regionid?"
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
          user_id: req.body.user_id,
          idol_id: req.body.idol_id
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
        user_id: req.body.user_id,
        idol_id: req.body.idol_id
      })
      .then(row => {
        console.log(row);
        res.json({status:true});
      })
      .catch((err) => res.json({status:false,err}));
  },

  hasFollowed: (req, res, next) => {

    const Op = req.app.locals.sequelize.Op;

    model(req).findOne({
       where: {
          [Op.and]: [
            { user_id: req.params.userid },
            { idol_id: req.params.idolid }
          ]
       }
    })
    .then(row => {
      if(row == null) res.json({status:false});
      row != undefined ? res.json({status:true}) : res.json({status:false});
    })
    .catch(() => (res.status(404)));
  },

  getForUser: (req, res, next) => {

    let sql = `SELECT i.*, i.firstname||i.lastname AS idol_name FROM follows AS f
    LEFT JOIN idols AS i ON f.idol_id = i.id
    WHERE user_id='${req.params.userid}'`;

    req.app.locals.sequelize
    .query(sql, { type: req.app.locals.sequelize.QueryTypes.SELECT})
    .then(row => {
      res.json(row);
    }).catch(next);
  },

  getRankingForRegion: (req, res, next) => {

    let region = req.params.regionid;
    let group_by_sql = "GROUP BY f.idol_id";
    let extra_join_sql = "";

    if(region != undefined)
    {
      group_by_sql += ",u.region_id";
      extra_join_sql = "AND t.region_id="+region;
    }

    let sql = `SELECT DISTINCT i.firstname, i.lastname, IFNULL(followers, 0) as followers, i.page_id
                FROM idols AS i

                LEFT JOIN (

                SELECT Count(f.id) as followers,f.id,f.user_id,f.idol_id,u.region_id FROM follows as f
                JOIN idols as i ON i.id = f.idol_id
                JOIN users as u ON u.id = f.user_id
                ${group_by_sql}
              ) as t ON t.idol_id = i.id ${extra_join_sql} ORDER BY followers DESC LIMIT 3`;

    req.app.locals.sequelize
    .query(sql, { type: req.app.locals.sequelize.QueryTypes.SELECT})
    .then(row => {
      res.json(row);
    }).catch(next);
  },
};
