const mongoose = require("mongoose");

const deviceSchem = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    deviceId:{
        type:String,
        required:true
    }
});
module.exports = mongoose.model('device',deviceSchem);
