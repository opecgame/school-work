const express = require(`express`);
const routes = express.Router();
const users = require("../database/users")
const leader = require("../database/leaderboard")
const jwt = require("jsonwebtoken")

routes.get("/", async (req, res) => {
    let member
    let cookie = req.cookies.get("pkwisfuckingschool__")
    if (!cookie) member = null;
    else {
        cookie = jwt.verify(cookie, config.jwtsecret)
        member = await users.findOne({
            id: cookie.id
        })
    }
    res.render("index", {
        member: member
    })
})

routes.get("/login", async (req, res) => {
    let cookie = req.cookies.get("pkwisfuckingschool__")
    if (cookie) return res.redirect("/");
    res.render("login")
})

routes.get("/logout", async (req, res) => {
    res.clearCookie("pkwisfuckingschool__");
    return res.redirect("/");
})

routes.get("/game", async (req, res) => {
    let cookie = req.cookies.get("pkwisfuckingschool__")
    if (!cookie) return res.redirect("/");
    cookie = jwt.verify(cookie, config.jwtsecret)
    let member = await users.findOne({
        id: cookie.id
    })
    res.render("game", {
        member: member
    })
})

routes.get("/leaderboard", async (req, res) => {
    let member
    let cookie = req.cookies.get("pkwisfuckingschool__")
    if (!cookie) member = null;
    else {
        cookie = jwt.verify(cookie, config.jwtsecret)
        member = await users.findOne({
            id: cookie.id
        })
    }

    let dataleader = await leader.findOne()

    score = await dataleader.games.sort(function(a, b){return b.score - a.score})
    res.render("leaderboard", {
        member: member,
        leaderboard : score
    })
})

routes.get("/gameff", async (req, res) => {
    let cookie = req.cookies.get("pkwisfuckingschool__")
    if (!cookie) return res.redirect("/");
    cookie = jwt.verify(cookie, config.jwtsecret)
    let member = await users.findOne({
        id: cookie.id
    })
    
    res.render("gameff", {
        member: member
    })
})

module.exports = routes;