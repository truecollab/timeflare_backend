const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const {reportService} = require('../services/index');



const getReport = catchAsync(async (req, res) => {
    const report = await reportService.generateReport(req.body);
         res.setHeader('Content-Type', 'application/pdf');
     res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
    // res.send(fileData);
    res.send(report);
}
);

module.exports = {
    getReport,
};