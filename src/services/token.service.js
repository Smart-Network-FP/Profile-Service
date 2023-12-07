const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

module.exports = ({ Token }, { userService, expertService, ...ext }) => {
  /**
   * Generate token
   * @param {ObjectId} userId
   * @param {Moment} expires
   * @param {string} type
   * @param {string} [secret]
   * @returns {string}
   */
  const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  };

  /**
   * Save a token
   * @param {string} token
   * @param {ObjectId} userId
   * @param {Moment} expires
   * @param {string} type
   * @param {boolean} [blacklisted]
   * @returns {Promise<Token>}
   */
  const saveToken = async (Token, token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await Token.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    });
    return tokenDoc;
  };
  /**
   * Verify token and return token doc (or throw an error if it is not valid)
   * @param {string} token
   * @param {string} type
   * @returns {Promise<Token>}
   */
  const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
    if (!tokenDoc) {
      throw new Error('Token not found');
    }
    return tokenDoc;
  };

  /**
   * Generate auth tokens
   * @param {User} user
   * @returns {Promise<Object>}
   */
  const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
    await saveToken(Token, refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  };

  /**
   * Generate expert auth tokens
   * @param {Expert} expert
   * @returns {Promise<Object>}
   */
  const generateExpertAuthTokens = async (Token, expert) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(expert.id, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(expert.id, refreshTokenExpires, tokenTypes.REFRESH);
    await saveToken(Token, refreshToken, expert.id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  };

  /**
   * Generate reset password token
   * @param {string} email
   * @returns {Promise<string>}
   */
  const generateResetPasswordToken = async (Token, userService, email) => {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
    }
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
    await saveToken(Token, resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
  };

  /**
   * Generate reset expert password token
   * @param {string} email
   * @returns {Promise<string>}
   */
  const generateExpertResetPasswordToken = async (Token, expertService, email) => {
    const expert = await expertService.getUserByEmail(email);
    if (!expert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No experts found with this email');
    }
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = generateToken(expert.id, expires, tokenTypes.RESET_PASSWORD);
    await saveToken(Token, resetPasswordToken, expert.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
  };

  /**
   * Generate verify email token
   * @param {User} user
   * @returns {Promise<string>}
   */
  const generateVerifyEmailToken = async (Token, user) => {
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
    await saveToken(Token, verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
  };
  return {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateExpertAuthTokens,
    generateResetPasswordToken,
    generateExpertResetPasswordToken,
    generateVerifyEmailToken,
  };
};
