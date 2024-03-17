const httpStatus = require('http-status');
const { Project, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Project
 * @param {Object} projectBody
 * @returns {Promise<Project>}
 */
const createProject = async (projectBody) => {
  const project = await Project.create(projectBody);
  projectBody.users.forEach(async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, `User with ID ${userId} not found`);
    }
    if (!user.projects.includes(project.id)) {
      user.projects.push(project.id);
      await user.save();
    }
  });
  const user = await User.findById(projectBody.createdBy);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, `User with ID ${projectBody.createdBy} not found`);
  }
  if (!user.managedProjects.includes(project.id)) {
    user.managedProjects.push(project.id);
    await user.save();
  }
  return project;
};

/**
 * Query for Project
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProject = async (filter, options) => {
  const project = await Project.paginate(filter, options);
  return project;
};

/**
 * Get Project by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getProjectById = async (projectId) => {
  return Project.findById(projectId);
};

/**
 * Get Project by email
 * @param {string} userId
 * @returns {Promise<Project>}
 */
const getAllProjectByUserId = async (userId) => {
  const userData = await User.findById(userId);
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, `User with ID ${userId} not found`);
  }
  const projectList = userData.get('projects');
  const projectListDetails = [];
  projectList.forEach((projectId) => {
    const projectData = Project.findById(projectId);
    projectListDetails.push(projectData);
  });
  return projectListDetails;
};

/**
 * Update Project by id
 * @param {ObjectId} projectId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const updateProjectById = async (projectId, updateBody) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, `Project with ID ${projectId} not found`);
  }
  // Check if createdBy field matches in both project and updateBody
  if (project.createdBy !== updateBody.createdBy) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authorized to change the data');
  }
  // Update the project with the remaining fields from updateBody excluding createdBy
  Object.keys(updateBody).forEach((key) => {
    if (key !== 'createdBy') {
      project[key] = updateBody[key];
    }
  });
  await project.save();
  return project;
};

/**
 * Delete Project by id
 * @param {ObjectId} projectId
 * @returns {Promise<Project>}
 */
const deleteProjectById = async (projectId, projectBody) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, `Project with ID ${projectId} not found`);
  }
  // Check if managerId matches createdBy
  if (project.createdBy !== projectBody.createdBy) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to delete this project');
  }
  // Remove project ID from the projects array inside each user
  project.users.forEach(async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, `User with ID ${projectBody.createdBy} not found`);
    }
    const index = user.projects.indexOf(project.id);
    if (index !== -1) {
      user.projects.splice(index, 1);
    }
    await user.save();
  });
  const user = await User.findById(projectBody.createdBy);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, `User with ID ${projectBody.createdBy} not found`);
  }
  const index = user.managedProjects.indexOf(project.id);
  if (index !== -1) {
    user.managedProjects.splice(index, 1);
  }
  await user.save();
  // Remove the project
  await project.remove();
  return project;
};

const addProjectMembers = async (projectId, projectBody) => {
  // Step 1: Add userId from projectBody into Project schema
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, `Project with ID ${projectId} not found`);
  }

  // Assuming projectBody.userId is an array of user IDs
  projectBody.users.forEach(async (userId) => {
    if (!project.users.includes(userId)) {
      project.users.push(userId);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, `User with ID ${userId} not found`);
    }
    if (!user.projects.includes(userId)) {
      user.projects.push(userId);
      await user.save();
    }
  });
  await project.save();
  return project;
};

const deleteProjectMembers = async (projectId, projectBody) => {
  try {
    // Step 1: Find the project by projectId
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(httpStatus.NOT_FOUND, `Project with ID ${projectId} not found`);
    }

    // Step 2: Remove users from the project and the project from each user's list
    projectBody.users.forEach(async (userId) => {
      const index = project.users.indexOf(userId);
      if (index !== -1) {
        project.users.splice(index, 1);
      }
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, `User with ID ${userId} not found`);
      }
      const projectIndex = user.projects.indexOf(projectId);
      if (projectIndex !== -1) {
        user.projects.splice(projectIndex, 1);
      }

      await user.save();
    });
    // Step 3: Save the changes to the project
    await project.save();
    return project;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong while removing users from the project');
  }
};

const viewProjectMembers = async (projectId) => {
  try {
    // Step 1: Find the project by projectId
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(httpStatus.NOT_FOUND, `Project with ID ${projectId} not found`);
    }
    // Step 2: Remove users from the project and the project from each user's list
    const userData = [];
    const userDataPromises = project.users.map(async (userId) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, `User with ID ${userId} not found`);
      }
      userData.push(user);
    });

    await Promise.all(userDataPromises);
    return userData;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong while getting users from the project');
  }
};

module.exports = {
  createProject,
  queryProject,
  getProjectById,
  getAllProjectByUserId,
  updateProjectById,
  deleteProjectById,
  addProjectMembers,
  deleteProjectMembers,
  viewProjectMembers,
};
