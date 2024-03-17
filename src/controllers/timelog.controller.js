const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { timelogService } = require('../services');

const createTimelog = catchAsync(async (req, res) => {
	const timelog = await timelogService.createTimelog(req.body);
	res.status(httpStatus.CREATED).send(timelog);
});

const getTimelogById = catchAsync(async (req, res) => {
	const timelog = await timelogService.getTimelogById(req.params.createdBy, req.body.timelogId);
	if (!timelog) {
		throw new ApiError(httpStatus.NOT_FOUND, 'timelog not found');
	}
	res.send(timelog);
});

const getAllTimelog = catchAsync(async (req, res) => {
	const timelog = await timelogService.getAllTimelog(req.params.createdBy);
	if (!timelog) {
		throw new ApiError(httpStatus.NOT_FOUND, 'timelog not found');
	}
	res.send(timelog);
});

const getDateRangeUserTimelog = catchAsync(async (req, res) => {	
	const timelog = await timelogService.getDateRangeUserTime(req.params.createdBy, req.params);
	if (!timelog) {
		throw new ApiError(httpStatus.NOT_FOUND, 'timelog not found');
	}
	res.send(timelog);
});

const getAllTimelogFilter = catchAsync(async (req, res) => {
	// const createdBy = req.params.createdBy;
	// const timelogId = req.params.timelogId;
	const filter = pick(req.query, ['name', 'role']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	const result = await timelogService.queryTimelog(filter, options);
	res.send(result);
});

const updateTimelogById = catchAsync(async (req, res) => {
	const timelog = await timelogService.updateTimelogById(req.params.createdBy, req.params.timelogId, req.body);
	res.send(timelog);
});

const deleteTimelogById = catchAsync(async (req, res) => {
	const user = await timelogService.deleteTimelogById(req.params.createdBy, req.params.timelogId);
	res.send(user);
});

const getTimelogByTimelogId = catchAsync(async (req, res) => {
	const user = await timelogService.deleteTimelogMembers(req.params.timelogId, req.body);
	res.send(user);
});

module.exports = {
	createTimelog,
	getTimelogById,
	getAllTimelog,
	updateTimelogById,
	deleteTimelogById,
	getTimelogByTimelogId,
	getAllTimelogFilter,
	getDateRangeUserTimelog
};
