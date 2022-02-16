const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Module } = require('../models/module');

// get all modules from DB collection 'modules'
// => localhost:3000/courseInfo/ 
router.get('/', (req, res)=>{
    Module.find((err, docs) =>{
        if(!err){ res.send(docs); }
        else{ console.log('Error in Retreiving Modules :' + JSON.stringify(err, undefined, 2)); }
    });
});


// get a single module with specified _id from DB collection 'modules'
// => localhost:3000/modules/_id 
router.get('/:id', (req, res)=>{
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
    Module.findById(req.params.id, (err, doc) => {
        if(!err){ res.send(doc); }
        else{ console.log('Error in Retreiving Module :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.put('/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
    var module_update = { 
        MAX : req.body.MAX,
        REGISTERED: req.body.REGISTERED,
        VACANCIES: req.body.VACANCIES,
        INDEX_LIST: req.body.INDEX_LIST
     };
     Module.findByIdAndUpdate(req.params.id, { $set : module_update }, { new: true }, (err, doc) => {
        if(!err){ res.send(doc); }
        else{ console.log('Error in Updating Module :' + JSON.stringify(err, undefined, 2)); }
     });
});


module.exports = router;