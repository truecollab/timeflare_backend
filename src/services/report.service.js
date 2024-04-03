//generate report service where using pupeetter you can generate the pdf report from the data of (user id, date range, project)

const httpStatus = require('http-status');
const { Report, User } = require('../models');
const ApiError = require('../utils/ApiError');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate a report
 * @param {Object} reportBody
 * @returns {Promise<Report>}
 */
const generateReport = async (reportBody) => {

    //generate pdf from getting data from timelog and making a pdf of table

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //Make content using the timelog data computed from the user id, date range, project
    const content = `
    <html>
    <head>
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
            }
            table, th, td {
                border: 1px solid black;
            }
            th, td {
                padding: 15px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
        <h1>Report</h1>
        <table>
            <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Time</th>
            </tr>
            <tr>
                <td>2021-10-01</td>
                <td>Project 1</td>
                <td>2 hours</td>
            </tr>
            <tr>
                <td>2021-10-02</td>
                <td>Project 2</td>
                <td>3 hours</td>
            </tr>
        </table>
    </body>
    </html>
    `;
    const fileName = uuidv4();
    const filePath = path.join(__dirname, `../reports/${fileName
    }.pdf`);
    //make pdf from the content
    await fs
        .writeFileSync(filePath, content);
    await page.setContent(content);
    await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
    });
    await browser.close();  
    reportBody.reportUrl = filePath;
    reportBody.reportName = fileName;
    reportBody.reportType = 'timesheet';
    reportBody.exportType = 'pdf';

    // const report = await Report.create(reportBody);
     const fileData = fs.readFileSync(filePath);
     
    //send the blob pdf file to the front end

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

module.exports = {
    generateReport,
    getReportById
};