const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  editProfile,
  suggestedUsers,
  followOfUnfollow,
  allUsers,
} = require('../controllers/userController');
const isAuthenticated = require('../middlewares/isAuthenticated');
const upload = require('../middlewares/multer');

const userRouter = express.Router();

userRouter.post('/register', registerUser);

userRouter.post('/login', loginUser);

userRouter.get('/logout', logoutUser);

userRouter.get('/:id/profile', isAuthenticated, getProfile);

userRouter.post(
  '/profile/edits',
  isAuthenticated,
  upload.single('profilePhoto'),
  editProfile
);

userRouter.get('/suggested', isAuthenticated, suggestedUsers);

userRouter.post('/follow-unfollow/:id', isAuthenticated, followOfUnfollow);

userRouter.get('/all', isAuthenticated, allUsers);

module.exports = userRouter;
