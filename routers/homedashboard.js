const express = require("express");
const router = express.Router();

//-----Home page Dashboard-----//
router.get("/",async function(req, res){
    res.render("../pages/homedashboard",{
        dashboardTitle: process.env.DASHBOARD_TITLE
    });
});

module.exports = router