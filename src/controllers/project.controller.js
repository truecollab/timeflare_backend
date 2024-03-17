const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService } = require('../services');

const createProject = catchAsync(async (req, res) => {
  const project = await projectService.createProject(req.body);
  res.status(httpStatus.CREATED).send(project);
});

const getProjectById = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  res.send(project);
});

const updatetProjectById = catchAsync(async (req, res) => {
  const project = await projectService.updateProjectById(req.params.projectId, req.body);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  res.send(project);
});

const deleteProjectById = catchAsync(async (req, res) => {
  await projectService.deleteProjectById(req.params.projectId, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

const addProjectMembers = catchAsync(async (req, res) => {
  const user = await projectService.addProjectMembers(req.params.projectId, req.body);
  res.send(user);
});

const deleteProjectMembers = catchAsync(async (req, res) => {
  const user = await projectService.deleteProjectMembers(req.params.projectId, req.body);
  res.send(user);
});

const viewProjectMembers = catchAsync(async (req, res) => {
  const user = await projectService.viewProjectMembers(req.params.projectId);
  res.send(user);
});

const getAllProjectByUserId = catchAsync(async (req, res) => {
  const user = await projectService.getAllProjectByUserId(req.params.userId);
  res.send(user);
});

module.exports = {
  createProject,
  getProjectById,
  updatetProjectById,
  deleteProjectById,
  addProjectMembers,
  deleteProjectMembers,
  viewProjectMembers,
  getAllProjectByUserId,
};
