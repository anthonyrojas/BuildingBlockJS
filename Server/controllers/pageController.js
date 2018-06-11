"use strict";
const config = require('../config');
const mongoose = require('mongoose');
const Page = require('../models/page');
const Entry = require('../models/entry');
exports.addPage = (req, res) =>{
    if(!req.body.name){
        res.status(400).json({message: 'You must enter a name for this page. It will serve as the permalink.'});
    }
    if(!req.body.title){
        res.status(400).json({message: 'You must enter a title for this page. Typically, it is the same as the page name.'});
    }
    let name = req.body.name;
    name = name.trim();
    name = name.replace(/ /g, '-');
    if(name.length > config.PAGE_NAME_MAX_LENGTH || name.length < config.PAGE_NAME_MIN_LENGTH){
        res.status(400).json({message: `Page name does not conform to the required length between ${config.PAGE_NAME_MIN_LENGTH} and ${config.PAGE_NAME_MAX_LENGTH} characters after being optimized for a permalink. Current length is: ${name.length}`});
    }
    Page.findOne({name: name}).then(pageFound=>{
        if(pageFound){
            res.status(400).json({message: 'A page with that name already exists.'});
        }
        var page = new Page({
            title: req.body.title,
            name: name
        });
        page.save((err, savedPage)=>{
            if(err){
                res.status(500).json({message: 'Database error. Could not create a new page at this time. Please try again later.'});
            }
            if(!savedPage){
                res.status(500).json({message: 'Database error. Could not create a new page at this time. Please try again later.'});
            }
            res.status(200).json({message: 'Page successfully created!'})
        });
    }).catch(dbErr=>{
        res.status(500).json({message: 'Database error. Unable to create a new page at this time. Please try again later.'});
    });
}

exports.removePage = (req, res)=>{
    if(!req.body.name){
        res.status(400).json({message: 'You must specify the page to delete.'});
    }
    Page.findOneAndRemove({name: req.body.name}).then(deletedPage=>{
        if(!deletedPage){
            res.status(404).json({message: 'Unable to find a page with that name.'});
        }
        const entries = deletedPage.content;
        Entry.deleteMany({_id: {$in: entries}}, (err)=>{
            if(err){
                res.status(500).json({message: 'Page deleted, but unable to delete the data associated with this page.'});
            }
            res.status(200).json({message: 'Page and content successfully deleted!'});
        })
    }).catch(dbErr=>{
        res.status(500).json({message: 'Unable to delete the page and/or its contents at this time.'});
    });
}