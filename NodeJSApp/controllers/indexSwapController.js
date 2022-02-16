const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { IndexSwap } = require('../models/indexSwap');

// get all students from DB collection 'students'
// => localhost:3000/modules/ 
router.get('/', (req, res)=>{
    IndexSwap.find((err, docs) =>{
        if(!err){ res.send(docs); }
        else{ console.log('Error in Retreiving indexSwap :' + JSON.stringify(err, undefined, 2)); }
    });
});


// get a single module with specified _id from DB collection 'modules'
// => localhost:3000/modules/_id 
router.get('/:id', (req, res)=>{
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
    IndexSwap.findById(req.params.id, (err, doc) => {
        if(!err){ res.send(doc); }
        else{ console.log('Error in Retreiving indexSwap :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.put('/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
    var indexSwap_update = { 
        registered: req.body.registered,
        current: req.body.current,
        queue: req.body.queue,
     };
     IndexSwap.findByIdAndUpdate(req.params.id, { $set : indexSwap_update }, { new: true }, (err, doc) => {
        if(!err){ res.send(doc); }
        else{ console.log('Error in Updating indexSwap :' + JSON.stringify(err, undefined, 2)); }
     });
});


module.exports = router;