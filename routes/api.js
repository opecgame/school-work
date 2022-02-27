const express = require(`express`);
const routes = express.Router();
const users = require(`../database/users.js`);
const jwt = require("jsonwebtoken")
const leader = require("../database/leaderboard");

routes.post("/loginAPI", async (req, res) => {
    if (!req.body.id) return res.json({
        msg: "กรุณาระบุ id"
    })
    if (parseInt(req.body.id) == "NaN") return res.json({
        msg: "กรุณาระบุ id"
    })
    let user = await users.findOne({
        id: req.body.id
    })
    if (!user) return res.json({
        msg: "ไม่พบข้อมูลของนักเรียนในฐานข้อมูล"
    })

    key = jwt.sign({
        id: req.body.id
    }, config.jwtsecret);
    res.cookies.set("pkwisfuckingschool__", key);
    console.log(`[LOGS] ${user.name} Loged in (${user.id})`)
    return res.json({
        status: true,
        msg: `ยินดีต้อนรับ ${user.name}`
    })

})

routes.post("/postScore", async (req, res) => {
    let key = res.cookies.get("pkwisfuckingschool__")
    if (!key) return res.json({
        msg: "กรุณาเข้าสู่ระบบ"
    })
    if (!req.body.time) return res.json({
        msg: "กรุณาระบุ time"
    })
    if (!req.body.score) return res.json({
        msg: "กรุณาระบุ score"
    })
    let decode = jwt.verify(key, config.jwtsecret)
    let usersLocal = await users.findOne({ id: decode.id });
    if(!usersLocal) return res.json({
        msg: "กรุณาเข้าสู่ระบบ"
    })
    await leader.findOneAndUpdate({id: '0'},{ $push: { games: {
        user : usersLocal,
        score : req.body.score,
        time : req.body.time
    } } })
    res.send("Hello World !")
})

routes.post("/checkAns", async (req, res) => {
    let theanswer = {
        image1: "กระดกเท้า",
        image2: "จีบคว่ำ",
        image3: "จีบล่อแก้ว",
        image4: "จีบหงาย",
        image5: "ตั้งวงล่าง",
        image6: "ตั้งวงบน",
        image7: "เขิน",
        image8: "ปฏิเสธ",
        image9: "รัก",
        image10: "เสียใจ",
    }
    if (!req.body.answers) return res.json({
        msg: "กรุณาระบุ คำตอบ"
    })
    req.body.answers = req.body.answers.replace("ท่า", "")
    req.body.answers = req.body.answers.replace("เขินอาย", "เขิน")
    req.body.answers = req.body.answers.replace("อาย", "เขิน")
    pc = checkpc(req.body.answers, theanswer[req.body.pattern])
    if (pc <= 60) return res.json({
        status: false,
        msg: "คำตอบคือ " + theanswer[req.body.pattern]
    })
    res.json({
        status: true
    })

})

function checkpc(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - checkdis(longer, shorter)) / parseFloat(longerLength) * 100;
}

function checkdis(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

module.exports = routes;