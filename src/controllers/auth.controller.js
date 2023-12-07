const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, expertService } = require('../services');

module.exports = ({ authService, userService, tokenService, emailService, expertService, elasticService }) => ({
  register: catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
  }),
  login: catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(user);
    res.send({ user, tokens });
  }),

  logout: catchAsync(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  }),

  refreshTokens: catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
  }),

  forgotPassword: catchAsync(async (req, res) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();
  }),

  resetPassword: catchAsync(async (req, res) => {
    await authService.resetPassword(req.query.token, req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
  }),

  sendVerificationEmail: catchAsync(async (req, res) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
    res.status(httpStatus.NO_CONTENT).send();
  }),

  verifyEmail: catchAsync(async (req, res) => {
    await authService.verifyEmail(req.query.token);
    res.status(httpStatus.NO_CONTENT).send();
  }),

  registerExpert: catchAsync(async (req, res) => {
    const expert = await expertService.createExpert(req.body);
    const tokens = await tokenService.generateAuthTokens(expert);
    await elasticService.indexOrUpdateProfile(expert);
    res.status(httpStatus.CREATED).send({ expert, tokens });
  }),

  loginExpert: catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const expert = await authService.loginExpertWithEmailAndPassword(email, password);
    console.log("expert", expert);
    const tokens = await tokenService.generateAuthTokens(expert);
    res.send({ expert, tokens });
  }),

  logoutExpert: catchAsync(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  }),

  refreshTokensExpert: catchAsync(async (req, res) => {
    const tokens = await authService.refreshExpertAuth(req.body.refreshToken);
    res.send({ ...tokens });
  }),

  forgotPasswordExpert: catchAsync(async (req, res) => {
    const resetPasswordToken = await tokenService.generateExpertResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();
  }),

  resetPasswordExpert: catchAsync(async (req, res) => {
    await authService.resetExpertPassword(req.query.token, req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
  }),
});

// module.exports = {
//   register,
//   login,
//   logout,
//   refreshTokens,
//   forgotPassword,
//   resetPassword,
//   sendVerificationEmail,
//   verifyEmail,
//   registerExpert,
//   loginExpert,
//   logoutExpert,
//   refreshTokensExpert,
//   forgotPasswordExpert,
//   resetPasswordExpert,
// };
