const userRouter = require('express').Router();
const { getUserByUserName } = require('../controllers/users.js');

userRouter.route('/:username')
    .get(getUserByUserName)

module.exports = userRouter;