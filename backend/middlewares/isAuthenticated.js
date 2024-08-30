const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: 'User not authenticated', success: false });
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decode) {
      return res
        .status(401)
        .json({ message: 'Invalid Credentaials', success: false });
    }

    req.id = decode.userID;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};


module.exports = isAuthenticated;
