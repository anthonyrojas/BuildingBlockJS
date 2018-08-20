const express = require('express');
const adminController = require('./controllers/adminController');
const authController = require('./controllers/authController');
const pageController = require('./controllers/pageController');
//router for public views
const publicRoutes = express.Router();
//router for admin views
const adminRoutes = express.Router();
//router for services views, such as file uploads or mail
const serviceRoutes = express.Router();
module.exports = (app)=>{
    //get the page data as a visitor
    publicRoutes.get('/page/:name', pageController.getPage);
    app.use('/api/public', publicRoutes);
    //load the admin dashboard
    adminRoutes.get('/', adminController.checkAdminExists, authController.verifyLoginPassInfo, adminController.getDashboard);
    //register the admin user for the first time
    adminRoutes.post('/register', adminController.register);
    //login to gain admin privileges
    adminRoutes.post('/login', adminController.checkAdminExists, adminController.login);
    //send the page data as an admin that is logged in
    adminRoutes.get('/page/:name', adminController.checkAdminExists, authController.verifyLogin);
    //create a new page as an admin
    adminRoutes.post('/page', adminController.checkAdminExists, authController.verifyLogin);
    //update a page and its contents
    adminRoutes.put('/page/:name', adminController.checkAdminExists, authController.verifyLogin);
    //delete a page
    adminRoutes.delete('/page/:name', adminController.checkAdminExists, authController.verifyLogin);
    //make a new entry
    adminRoutes.post('/entry', adminController.checkAdminExists, authController.verifyLogin);
    //get the entries of a specific page
    adminRoutes.get('/entry/:page', adminController.checkAdminExists, authController.verifyLogin);
    //update an entry
    adminRoutes.put('/entry/:id', adminController.checkAdminExists, authController.verifyLogin);
    //delete an emtry
    adminRoutes.delete('/entry/:id', adminController.checkAdminExists, authController.verifyLogin);
    app.use('/api/admin', adminRoutes);
    //view the media uploads as an admin only
    serviceRoutes.get('/media', authController.verifyLogin);
    //get the information for a single specific media file
    serviceRoutes.get('/media/:id', authController.verifyLogin);
    //upload a media file, that can be an image, video, gif, audio file, etc.
    serviceRoutes.post('/media', authController.verifyLogin);
    //delete a media file from the server
    serviceRoutes.delete('/media/:id', authController);
    //send an email from the contact form
    serviceRoutes.post('/mail');
    app.use('/api/service', serviceRoutes);
}