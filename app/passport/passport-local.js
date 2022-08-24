const passport = require('passport')
const localStrategy = require('passport-local');
const User = require('../model/User');


passport.use('loca.register', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passRequestToCallback: true
}, (req, email, password, done) => {
    User.findOne({ 'email': email }, (err, user) => {
        if (err) return done(err);
        if(user) return done(err,false,req.flash("User alrealy exits"));

        const newUser = new User({
            email: req.body.email,
            password: req.body.password,
        });

        newUser.save( (err) => {
            if (err) return done(err,false,req.flash("exites problem whene reate new user"));
            return done(null,newUser);
        });

    });
}))