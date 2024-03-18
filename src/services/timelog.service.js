const httpStatus = require('http-status');
const Timelog = require('../models/timelog.model');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

const createTimelog = async (timelogBody) => {
  // Check if the project exists in the user's projects array
  const user = await User.findById(timelogBody.createdBy);
  if (!user || !user.projects.includes(timelogBody.projectId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is not authorized to add time logs to this project');
  }
  // Check for overlapping time entries
  const overlappingTimelog = await Timelog.findOne({
    createdBy: timelogBody.createdBy,
    $or: [
      {
        startTime: { $lte: timelogBody.endTime },
        endTime: { $gte: timelogBody.startTime },
      },
      {
        startTime: { $gte: timelogBody.startTime },
        endTime: { $lte: timelogBody.endTime },
      },
      {
        startTime: { $gte: timelogBody.startTime, $lte: timelogBody.endTime },
        endTime: { $gte: timelogBody.endTime },
      },
      {
        startTime: { $lte: timelogBody.startTime },
        endTime: { $lte: timelogBody.endTime, $gte: timelogBody.startTime },
      },
    ],
  });

  if (overlappingTimelog) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Overlapping time entry is not allowed');
  }

  const timelog = await Timelog.create(timelogBody);
  return timelog;
};

const getTimelogById = async (userId, timelogId) => {
  const timelog = await Timelog.findOne({ _id: timelogId, createdBy: userId });
  if (!timelog) {
    throw new ApiError(httpStatus.NOT_FOUND, `Timelog with given parameters not found`);
  }
  return timelog;
};

const getAllTimelog = async (userId) => {
  const timelogs = await Timelog.find({ createdBy: userId });
  return timelogs;
};

const updateTimelogById = async (userId, timelogId, timelogBody) => {
  const timelog = await getTimelogById(userId, timelogId);

  // Check for overlapping time entries excluding the current one
  const overlappingTimelog = await Timelog.findOne({
    createdBy: timelogBody.createdBy,
    projectId: timelogBody.projectId,
    _id: { $ne: timelogId },
    $or: [
      { startTime: { $lte: timelogBody.endTime }, endTime: { $gte: timelogBody.startTime } },
      { startTime: { $gte: timelogBody.startTime }, endTime: { $lte: timelogBody.endTime } },
    ],
  });

  if (overlappingTimelog) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Overlapping time entry is not allowed');
  }

  Object.assign(timelog, timelogBody);
  await timelog.save();
  return timelog;
};

const getDateRangeUserTime = async (createdBy, timelogBody) => {
  const timelog = await Timelog.find({
    createdBy,
    startTime: { $gte: timelogBody.startTime, $lte: timelogBody.endTime },
  });
  return timelog;
};

const queryTimelog = async (filter, options) => {
  const timelog = await Timelog.paginate(filter, options);
  return timelog;
};

const deleteTimelogById = async (userId, timelogId) => {
  const timelog = await getTimelogById(userId, timelogId);
  await timelog.remove();
  return timelog;
};

const getTimelogByProjectId = async (projectId) => {
  const timelogs = await Timelog.find({ projectId });
  return timelogs;
};

module.exports = {
  createTimelog,
  getTimelogById,
  getAllTimelog,
  queryTimelog,
  updateTimelogById,
  deleteTimelogById,
  getTimelogByProjectId,
  getDateRangeUserTime,
};
