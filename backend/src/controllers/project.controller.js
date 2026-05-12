const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    let query;
    if (req.user.role === 'admin') {
      query = {};
    } else {
      query = { members: req.user._id };
    }

    const projects = await Project.find(query)
      .populate('createdBy', 'name email avatar')
      .populate('members', 'name email avatar');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Admin only)
exports.createProject = async (req, res) => {
  try {
    const { projectName, description, members } = req.body;

    const project = await Project.create({
      projectName,
      description,
      members: members || [req.user._id],
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project details
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && !project.members.some(m => m._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    const tasks = await Task.find({ projectId: req.params.id })
      .populate('assignedTo', 'name email avatar')
      .populate('assignedBy', 'name');

    res.json({ project, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.deleteOne({ _id: req.params.id });
    await Task.deleteMany({ projectId: req.params.id });

    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private (Admin only)
exports.addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { userId } = req.body;

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User already in project' });
    }

    project.members.push(userId);
    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate('members', 'name email avatar');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
