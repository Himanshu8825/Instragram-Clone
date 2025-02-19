const express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const upload = require('../middlewares/multer');
const {
  addNewPost,
  getAllPost,
  getUserPosts,
  likePost,
  dislikePost,
  addComment,
  commentsForSapratePost,
  deletePost,
  bookMarkPost,
} = require('../controllers/postController');

const postRouter = express.Router();

postRouter.post(
  '/addpost',
  isAuthenticated,
  upload.single('image'),
  addNewPost
);

postRouter.get('/all', isAuthenticated, getAllPost);

postRouter.get('/userpost/all', isAuthenticated, getUserPosts);

postRouter.get('/:id/like', isAuthenticated, likePost);

postRouter.get('/:id/dislike', isAuthenticated, dislikePost);

postRouter.post('/:id/comment', isAuthenticated, addComment);

postRouter.get('/:id/comment/all', isAuthenticated, commentsForSapratePost);

postRouter.delete('/delete/:id', isAuthenticated, deletePost);

postRouter.post('/:id/bookmark', isAuthenticated, bookMarkPost);

module.exports = postRouter;
