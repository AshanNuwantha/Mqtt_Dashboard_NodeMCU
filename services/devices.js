const express = require('express')
const services = express.Router()
const deviceModel = require('../models/device'); // handel

services.get('/list',async function(req,res){
    try{
        const device =  await deviceModel.find()
        res.status(200).json(device);
    }catch(err){
        res.status(503).send('error '+err);
    }   
});

services.get('/devices',async function(req,res){
    
    try{
        const device =  await deviceModel.find()
        res.json(device);
    }catch(err){
        res.send(JSON.stringify({
            errors: " "+err+" "
            })
        );
    }   
});

services.post('/add' ,async function(req,res){
    const device = new deviceModel({
        name: req.body.name,
        deviceId: req.body.deviceId
    }); 
    try{
        const deviceResult = await device.save();
        res.status(200).json(deviceResult);
    }catch(err){
        res.status(503).send('error '+err);
    }
});

services.delete('/delete' ,async function(req,res){
    try{
        const device = await deviceModel.findById(req.body.id);
        await deviceModel.deleteOne({_id:device._id});
        res.status(200).json(device);
    }catch(err){
        res.status(503).send('error '+err);
    }
});

module.exports = services;