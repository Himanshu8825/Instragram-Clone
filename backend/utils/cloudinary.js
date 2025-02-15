require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dh3nmgwdy',
  api_key: 646725383153849,
  api_secret: 'whxJXhcgQ2-uVRJKBGKSAQ86YJ8',
  secure: true,
});

module.exports = cloudinary;
