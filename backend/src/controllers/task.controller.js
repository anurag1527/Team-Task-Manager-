const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    let query;
    if (req.user.role === 'admin') {
      // Admins see everything
      query = {};
    } else {
      // Members see tasks where they are in the assignedTo array
      query = { assignedTo: { $in: [req.user._id] } };
    }

    const tasks = await Task.find(query)
      .populate('projectId', 'projectName')
      .populate('assignedTo', 'name email avatar')
      .populate('assignedBy', 'name');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate, priority, status } = req.body;

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      assignedBy: req.user._id,
      dueDate,
      priority,
      status: status || 'todo',
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('assignedBy', 'name');

    // Notify project members via Socket.IO
    const io = req.app.get('socketio');
    io.to(projectId.toString()).emit('task-created', populatedTask);

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status/details
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && !task.assignedTo.some(id => id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Members can only update their own assigned tasks' });
    }

    // Members can ONLY update status, Admins can update everything
    const updateData = req.user.role === 'admin' ? req.body : { status: req.body.status };

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('assignedTo', 'name email avatar');

    const io = req.app.get('socketio');
    io.to(task.projectId.toString()).emit('task-updated', updatedTask);
    // Also emit globally for dashboards to catch updates
    io.emit('task-updated-global', updatedTask);

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.deleteOne({ _id: req.params.id });

    const io = req.app.get('socketio');
    io.to(task.projectId.toString()).emit('task-deleted', req.params.id);

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = {
      user: req.user._id,
      text: req.body.text,
    };

    task.comments.push(comment);
    await task.save();

    const updatedTask = await Task.findById(req.params.id)
      .populate('comments.user', 'name avatar')
      .populate('assignedTo', 'name email avatar');

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
