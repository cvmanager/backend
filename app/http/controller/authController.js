const res = require('express/lib/response');
const controller = require('./controller');
const { validationResult } = require('express-validator');
const passport = require('passport');

class authController extends controller {
    showLoginForm(req, res) {
        res.render('auth/loginForm');
    }

    showRegisterForm(req, res) {
        res.render('auth/registerForm', {
            errors: req.flash('errors'),
            success: req.flash('success'),
        });
    }

    async register(req, res,next) {
        const result = validationResult(req);
        let errors = [];
        if (!result.isEmpty()) {
            result.errors.forEach((item) => {
                errors.push(item.msg);
            });

            req.flash('errors', errors)
            res.redirect('/auth/register');
            return;
        }

        registerProccess(req, res,next);


        res.send('OK');
        return false;
    }

     registerProccess(req, res,next) {
        passport.authenticate('local.register' , {
            successRedirect : '/',
            failureRedirect : '/auth/register',
            failureFlash : true
        })(req,res,next)
    }
}

module.exports = new authController;