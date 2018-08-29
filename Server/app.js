const config = require('./config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const helmet = require('helmet');
const routes = require('./routes');
const http = require('http');
const express = require('express');
var app = express();
const server = http.createServer(app);
const mongoose = require('mongoose');
const Page = require('./models/page');
mongoose.connect(config.DB_HOST, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    console.log('connected to db');
    Page.findOne({name: 'home'})
    .then(pagesFound =>{
        if(!pagesFound){
            var homePage = new Page({
                name: 'home',
                title: 'BuildingBlockJS CMS | Home'
            });
            homePage.save((err, savedPage)=>{
                if(err){
                    console.log('unable to create the home page on init');
                }
            });
        }
    }).catch(err => {
        var homePage = new Page({
            name: 'home',
            title: 'JS CMS | Home'
        });
        homePage.save((err, savedPage)=>{
            if(err){
                console.log('unable to create the home page on init');
            }
        });
    });
});
app.set('trust proxy', '127.0.0.1');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.disable('x-powered-by');
routes(app);
app.get('*', function(req, res, next) {
    var err = new Error('Invalid path. Page not found.');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next)=>{
    if(err.message){
        return res.status(err.status).json({message: err.message});
    }else{
        return res.status(500).json({message: 'Oops! Something went wrong'});
    }
});
server.listen(config.PORT || process.env.PORT, ()=>{
    console.log(`Listening on port ${config.PORT}`);
});