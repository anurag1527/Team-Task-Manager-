const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  createProject, 
  getProjectById, 
  updateProject, 
  deleteProject 
} = require('../controllers/project.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(authorize('admin'), createProject);

router.route('/:id')
  .get(getProjectById)
  .put(authorize('admin'), updateProject)
  .delete(authorize('admin'), deleteProject);

router.put('/:id/members', authorize('admin'), require('../controllers/project.controller').addMember);

module.exports = router;
