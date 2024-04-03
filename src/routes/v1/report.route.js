const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reportValidation = require('../../validations/report.validation');
const reportController = require('../../controllers/report.controller');

const router = express.Router();

//Make PDF report for the user
//Take the user id and the date range, project
// calling this is front end const response = await api.post(`v2/reports/report/export`, { 
//     exportType: exportType,
//     reportType: 'timesheet',
//     startTime: selectedDate || new Date().toISOString(), // Set default start time if selectedDate is null
//     endTime: new Date().toISOString(),
//     projects: selectedProjects
//   });

router.route('/export')
    .post(auth('getReport'), validate(reportValidation.getReport), reportController.getReport);


module.exports = router;