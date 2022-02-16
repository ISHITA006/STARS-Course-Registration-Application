const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Student } = require('../models/student');

// get all students from DB collection 'students'
// => localhost:3000/modules/ 
router.get('/', (req, res)=>{
    Student.find((err, docs) =>{
        if(!err){ res.send(docs); }
        else{ console.log('Error in Retreiving Students :' + JSON.stringify(err, undefined, 2)); }
    });
});


// get a single module with specified _id from DB collection 'modules'
// => localhost:3000/modules/_id 
router.get('/:id', (req, res)=>{
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
    Student.findById(req.params.id, (err, doc) => {
        if(!err){ res.send(doc); }
        else{ console.log('Error in Retreiving student :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.put('/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
    var student_update = { 
        TOTAL_AU: req.body.TOTAL_AU,
        REGISTERED_COURSES: req.body.REGISTERED_COURSES,
        SAVED_PLANS: req.body.SAVED_PLANS
     };
     Student.findByIdAndUpdate(req.params.id, { $set : student_update }, { new: true }, (err, doc) => {
        if(!err){ res.send(doc); }
        else{ console.log('Error in Updating student :' + JSON.stringify(err, undefined, 2)); }
     });
});


module.exports = router;