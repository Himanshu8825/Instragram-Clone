const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getDataUri = require('../utils/dataUri');

const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ message: 'All fields are required', success: false });
    }

    //!Already User registered
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: 'User already registered', success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: 'User registered successfully', success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'All fields are required', success: false });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'User not found', success: false });
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password);

    if (!isMatchedPassword) {
      return res
        .status(401)
        .json({ message: 'Invalid Password', success: false });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d',
    });

    user = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: User.followers,
      followings: User.following,
      posts: User.posts,
      token,
    };

    return res
      .status(200)
      .cookie('token', token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json({
        message: `Welcome back ${user.userName}`,
        success: true,
        user,
        token: token,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie('token');
    return res
      .status(200)
      .json({ message: 'Logged out successfully', success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false });
  }
};

const getProfile = async (req, res) => {
  try {
    const userID = req.params.id;

    let user = await User.findById(userID);

    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false });
  }
};

const editProfile = async (req, res) => {
  try {
    const userID = req.id;

    const { bio, gender } = req.body;
    const profilePicture = req.file;

    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    if (bio) {
      user.bio = bio;
    }

    if (gender) {
      user.gender = gender;
    }

    if (profilePicture) {
      User.profilePicture = cloudResponse.secure_url;
    }

    await User.save();

    return res
      .status(200)
      .json({ message: 'Profile Updated', User, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false });
  }
};

const suggestedUsers = async (req, res) => {
  try {
    const suggestedUser = await User.findOne({ _id: { $ne: req.id } }).select(
      '-password'
    );

    if (!suggestedUser) {
      return res
        .status(404)
        .json({ message: 'No suggested users found', success: false });
    }

    return res.status(200).json({ users: suggestedUser, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false });
  }
};

const followOfUnfollow = async (req, res) => {
  try {
    const followers = req.id;
    const following = req.params.id;

    if (followers === following) {
      return res
        .status(400)
        .json({ message: 'Cannot follow yourself', success: false });
    }

    const user = await User.findById(followers);

    const targetUser = await User.findById(following);

    if (!user || !targetUser) {
      return res
        .status(404)
        .json({ message: 'User not found', success: false });
    }

    const isFollowing = User.following.includes(following);

    if (isFollowing) {
      await Promise.all([
        User.updateOne({ _id: followers }, { $pull: { following: following } }),
        User.updateOne({ _id: following }, { $pull: { followers: followers } }),
      ]);
      return res
        .status(200)
        .json({ message: 'Unfollowed Successfully', success: true });
    } else {
      await Promise.all([
        User.updateOne({ _id: followers }, { $push: { following: following } }),
        User.updateOne({ _id: following }, { $push: { followers: followers } }),
      ]);
      return res
        .status(200)
        .json({ message: 'Followed Successfully', success: true });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  editProfile,
  suggestedUsers,
  followOfUnfollow,
};
