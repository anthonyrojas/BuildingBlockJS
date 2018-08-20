const Admin = require('../models/admin');
const Page = require('../models/page');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');
const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
exports.checkAdminExists = (req, res, next)=>{
    Admin.find({}).then(adminFound=>{
        if(adminFound){
            //an admin exists, meaning the user can continue
            next();
        }
        //the admin has not been registered
        return res.status(404).json({message: 'You must register as an admin to finish setting up your site.', adminStatus: false});
    }).catch(err=>{
        return res.status(400).json({message: 'Could not check admin status. Database error.', error: err.toString()});
    });
}

exports.register = (req, res)=>{
    if(!req.body.email){
        return res.status(400).json({message: 'You must enter a valid email.'});
    }else if(emailRegex.test(req.body.email) === false){
        return res.status(400).json({message: 'You must enter a valid email.'});
    }
    if(!req.body.username){
        return res.status(400).json({message: 'You must enter a username.'});
    }
    else if(/\s/g.test(req.body.username) === false){
        return res.status(400).json({message: 'Your username may not contain whitespace.'});
    }
    const username = req.body.username;
    if(username.length > config.USERNAME_MAX_LENGTH || username.length < config.USERNAME_MIN_LENGTH){
        return res.status(400).json({});
    }
    if(!req.body.firstName){
        return res.status(400).json({message: 'You must enter your first name.'});
    }
    if(!req.body.lastName){
        return res.status(400).json({message: 'You must enter your last name.'});
    }
    if(!req.body.password){
        return res.status(400).json({message: 'You must enter a password.'});
    }
    if(!req.body.confirmPassword){
        return res.status(400).json({message: 'You must confirm your password.'});
    }
    if(req.body.confirmPassword !== req.body.password){
        return res.status(400).json({message: 'Your passwords do not match.'});
    }
    Admin.findOne({username: req.body.username}).then(adminFound => {
        if(adminFound){
            //strange error that should not occur on initialization
            //an admin has already been made, in which case cease the registration
            return res.status(500).json({message: 'It appears there is already an administrator for this site.'});
        }
        bcrypt.genSalt(config.SALT_ROUNDS, (err, salt)=>{
            bcrypt.hash(req.body.password, salt, (err, hashedPassword)=>{
                if(err){
                    return res.status(500).json({message: 'Unable to securely register you at this time. Try again later.'});
                }
                let admin = new Admin({
                    username: req.body.username,
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: hashedPassword
                });
                admin.save((err, savedAdmin)=>{
                    if(err){
                        res.status(500).json({message: 'Database error. Unable to register you at this time. Please try again later.'});
                    }
                    savedAdmin.password = undefined;
                    return res.status(200).json({message: 'Successfully registered admin!', admin: savedAdmin});
                });
            });
        });
    }).catch(dbErr=>{
        return res.status(500).json({message: 'Database error. Cannot complete registation at this time.'});
    });
}

exports.login = (req, res, next)=>{
    if(!req.body.username){
        return res.status(400).json({message: 'Username required.'});
    }
    if(!req.body.password){
        return res.status(400).json({message: 'Password required.'});
    }
    const password = req.body.password;
    Admin.findOne({username: req.body.username}).then(admin=>{
        if(admin){
            bcrypt.compare(password, admin.password, (err, compareRes)=>{
                if(!compareRes){
                    return res.status(404).json({message: 'Wrong password.'});
                }
                res.locals.username = admin.username;
                res.locals.email = admin.email;
                next();
            })
        }
        return res.status(404).json({message: 'Wrong username.'});
    }).catch(dbErr=>{
        return res.status(500).json({message: 'Database error. Cannot login at this time.'});
    });
}
exports.getConfiguration = (req, res, next)=>{
    Admin.findOne({username: res.locals.username}).then(userFound=>{
        if(userFound){
            res.locals.user = userFound;
            res.locals.username = undefined;
            next();
        }
        return res.status(404).json({message: 'Unable to obtain your admin data at this time.'});
    }).catch(err => {
        return res.status(404).json({message: 'Unable to obtain your admin data at this time.'});
    });
}
//send the dashboard data to the client
exports.getDashboard = (req, res)=>{
    Page.find({}).populate('content').exec((err, pages)=>{
        if(err){
            res.status(500).json({message: 'Unable to obtain your admin data at this time.'});
        }
        return res.status(200).json({message: `Welcome, ${res.locals.user.firstName} ${res.locals.user.lastName}!`, admin: res.locals.user, pages: pages});
    });
}