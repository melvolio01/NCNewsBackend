const User = require('../models/index.js').User;

const getUserByUserName = (req, res, next) => {
    let enteredName = req.params.username;
    User.findOne({username: enteredName})
    .then(user => {
        if (user.username !== null) res.status(200).send({user});
    })
    .catch(err => {
        next({status:404, message: 'No user goes by that username'});
    });
}

module.exports = { getUserByUserName };