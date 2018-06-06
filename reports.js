const Report = require("../models/Report");
const User = require("../models/User");
const Chart = require("../models/Chart");
const info = require('os');



/**
 * GET /reports
 * Reports page.
 */
exports.getReports = (req, res, next) => {
    var user = req.user;
    var populatePlanPromise = user ? user.populate("subscription.plan").execPopulate() : null;
    var userPracticeId = user ? user.practiceId : null;    
    Promise.all([
        Report.find({ practiceId: [null, userPracticeId] }, {
            viewFilePath: false,
            configFilePath: false,
            data: false
        }).sort({ name: 1 }),
        populatePlanPromise
    ]).then(function (results) {
        var reports = results[0];
        res.render("reports", {
            title: "Reports",
            reports: reports
        });
    }).catch(next);
};

/**
 * GET /report/:id
 * Report page.
 */
exports.getReport = (req, res, next) => {
    var user = req.user;
    var userPracticeId = user ? user.practiceId : null; 
    Promise.all([
        req.user.populate("subscription.plan").execPopulate(),
        Report.findById(req.params.id),
        Chart.find({practiceId: userPracticeId})        
    ]).then(function (results) {
        var user = results[0];
        var report = results[1];
        var series = results[2];
        
        if (!report || !user.hasReport(report)) {
            return res.redirect("/reports");
        }

        res.render(report.viewFilePath, {
            title: `${report.name} - Report`,
            report: report,
            info: 'information',
            series: series
        });
    }).catch(next);
};