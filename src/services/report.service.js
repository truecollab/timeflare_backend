//generate report service where using pupeetter you can generate the pdf report from the data of (user id, date range, project)

const httpStatus = require('http-status');
const { Report, User } =require('../models');
const ApiError = require('../utils/ApiError');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const timeLogService = require('./timelog.service');
const projectService = require('./project.service');
const emailService = require('./sendEmail.service');
//projectid and project title map

var projectMap = {};
/**
 * Generate a report
 * @param {Object} reportBody
 * @returns {Promise<Report>}
 */
const generateReport = async (reportBody) => {

    //generate pdf from getting data from timelog and making a pdf of table

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    var timelogBody = {
        createdBy: reportBody.createdBy,
        startTime: reportBody.startTime,
        endTime: reportBody.endTime,
        projects: reportBody.projects
    }
    var timelogs = await timeLogService.getDateRangeUserTime(reportBody.createdBy, timelogBody);
    // sort timelogs by start time
    timelogs.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    //TODO: Use the user id, date range, project to get the timelog data  from report body
    //and make the HTML for report content

    console.log(timelogs);
    //Make content using the timelog data computed from the user id, date range, project
    const content = generateReportTable(timelogs);
    const fileName = uuidv4();
    const filePath = path.join(__dirname, `../reports/${fileName
    }.pdf`);
    //make pdf from the content
    (async () => {
     await fs
        .writeFileSync(filePath, content);
    await page.setContent(content);
    await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
    });
    await browser.close();  
    })();
    reportBody.reportUrl = filePath;
    reportBody.reportName = fileName;
    reportBody.reportType = 'timesheet';
    reportBody.exportType = 'pdf';

    // const report = await Report.create(reportBody);
    const fileData = fs.readFileSync(filePath);
    await emailService.sendEmail(
      {
        "to" : "nikhilram@vt.edu",
        "subject": "Sending Mail for your latest Invoice",
        "text": "Thank you for working with us, please find your attached invoice. We are pleased to have your service. Thank you",
        "filename": fileName,
        "pdfPath": filePath
       }
    )
   // await emailService.sendEmailWithAttachment('nikhilram@vt.edu', 'Report', 'Please find the attached report', [{ filename: "Report.pdf", path: filePath }]);
    return fileData;

}
/**
 * Get Report by id
 * @param {ObjectId} id
 * @returns {Promise<Report>}
 */
const getReportById = async (reportId) => {
    return Report
        .findById(reportId)
        .populate('createdBy')
        .populate('projects')
        .populate('timelog');
}

function generateReportTable(data) {
    // Initialize variables to store the HTML table and total time spent
    let tableHtml = `
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Time Spent</th>
          </tr>
        </thead>
        <tbody>
    `;
    let totalTimeSpent = 0;
  
    // Loop through each entry in the data array
    data.forEach(entry => {
      // Calculate time spent (difference between end time and start time)
      const startTime = new Date(entry.startTime);
      const endTime = new Date(entry.endTime);
      const timeSpent = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours
  
      // Add time spent to the total
      totalTimeSpent += timeSpent;
  
      // Append a row for the current entry to the tableHtml
      tableHtml += `
        <tr>
          <td>${entry.title}</td>
          <td>${entry.description}</td>
          <td>${startTime.toLocaleString()}</td>
          <td>${endTime.toLocaleString()}</td>
          <td>${timeSpent.toFixed(2)} hours</td>
        </tr>
      `;
    });
  
    // Close the table
    tableHtml += `
        </tbody>
      </table>
    `;
  
    // Add the total time spent row
    tableHtml += `
      <div>
        <p>Total Time Spent: ${totalTimeSpent.toFixed(2)} hours</p>
      </div>
    `;
  
    // Return the generated HTML table
    return tableHtml;
  }
  

module.exports = {
    generateReport,
    getReportById
};