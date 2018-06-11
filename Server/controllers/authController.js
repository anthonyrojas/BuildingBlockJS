"use strict";
const config = require('../config');
const jwt = require('jsonwebtoken');
exports.generateToken = (req, res)=>{
    const token = jwt.sign({email: res.locals.email, username: res.locals.username}, config.SECRET, {expiresIn: '168h'});
    res.status(200).json({message: 'Welcome! Please not that your login will expire in a week (168 hours to be exact).', token: token});
}
exports.verifyLogin = (req, res, next)=>{
    const token = req.headers.authorization;
    jwt.verify(token, config.SECRET, (err,decoded)=>{
        if(err){
            res.status(403).json({message: 'Unauthorized! Please sign in again to get a valid token.'});
        }
        if(decoded.username && decoded.email){
            next();
        }
        res.status(403).json({message: 'Unauthorized! Please sign in again to get a valid token.'});
    });
}
exports.verifyLoginPassInfo = (req, res, next)=>{
    const token = req.headers.authorization;
    jwt.verify(token, config.SECRET, (err, decoded)=>{
        if(err){
            res.status(403).json({message: 'Unauthorized! Please sign in again to get a valid token.'});
        }
        if(!decoded.username){
            res.status(403).json({message: 'Unauthorized! It appears your token has been tampered with. Clear your cookies and sign in again.'});
        }
        res.locals.username = decoded.username;
        next();
    });
}