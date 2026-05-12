const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', authorize('admin'), getUsers);
router.route('/:id')
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

module.exports = router;
