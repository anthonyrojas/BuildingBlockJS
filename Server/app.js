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
mongoose.Promise = global.Promise;
mongoose.connect(config.DB_HOST);
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
        res.status(err.status);
        res.json({message: err.message});
    }else{
        res.status(500).json({message: 'Oops! Something went wrong'});
    }
});
server.listen(config.PORT || process.env.PORT);