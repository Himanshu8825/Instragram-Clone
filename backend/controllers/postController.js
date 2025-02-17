const sharp = require('sharp');
const cloudinary = require('../utils/cloudinary');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res
        .status(400)
        .json({ sucess: false, message: 'Please upload an image' });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      'base64'
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: 'author', select: '-password' });

    return res
      .status(201)
      .json({ success: true, post, message: 'Post created successfull' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ sucess: false, message: 'Error while adding new post' });
  }
};

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: '-1' })
      .populate({ path: 'author', select: 'username , profilePicture' })
      .populate({
        path: 'comments',
        sort: { createdAt: '-1' },
        populate: { path: 'author', select: 'username , profilePicture' },
      });

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ success: false, message: 'Error while fetching all posts' });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: '-1' })
      .populate({ path: 'autho', select: 'username , profilePicture' })
      .populate({
        path: 'comments',
        sort: { createdAt: '-1' },
        populate: { path: 'author', select: 'username , profilePicture' },
      });

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ success: false, message: 'Error while fetching' });
  }
};

const likePost = async (req, res) => {
  try {
    const likedUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    await post.updateOne({ $addToSet: { likes: likedUserId } });

    await post.save();

    return res
      .status(200)
      .json({ success: true, message: 'You have liked this post' });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ success: false, message: 'Error while likeing the post' });
  }
};

const dislikePost = async (req, res) => {
  try {
    const likedUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    await post.updateOne({ $pull: { likes: likedUserId } });

    await post.save();

    return res
      .status(200)
      .json({ success: true, message: 'You have disLiked this post' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'error while dislike' });
  }
};

const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentedUserId = req.id;

    const { text } = req.body;
    const post = await Post.findById(postId);

    if (!text) {
      return res
        .status(400)
        .json({ success: false, message: 'Comment text is required' });
    }

    const comment = await Comment.create({
      text,
      author: commentedUserId,
      post: postId,
    }).populate({ path: 'author', select: 'username , profilePicture' });

    post.comments.push(comment._id);
    await post.save();

    return res
      .status(201)
      .json({ success: true, comment, message: 'Comment added successfully' });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: 'error while adding comment' });
  }
};

const commentsForSapratePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ id: postId }).populate(
      'author',
      'username ,profilePicture'
    );

    if (!comments) {
      return res
        .status(404)
        .json({ success: false, message: 'No comments found for this post' });
    }
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: 'error while fetching comments' });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    }

    await Post.findByIdAndDelete(postId);

    let user = await User.findById(authorId);
    user.posts = user.posts.filter((p) => p.toString() !== postId);

    await user.save();

    await Comment.deleteMany({ post: postId });

    return res
      .status(200)
      .json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: 'error while deleting post' });
  }
};

const bookMarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    const user = await User.findById(authorId);

    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post_id } });
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: 'Post remove from successfully' });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post_id } });
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: 'Post bookmarked successfully' });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: 'error while bookmarking post' });
  }
};

module.exports = {
  addNewPost,
  getAllPost,
  getUserPosts,
  likePost,
  dislikePost,
  addComment,
  commentsForSapratePost,
  deletePost,
  bookMarkPost,
};
