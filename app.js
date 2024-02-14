/*
npm init
npm install ejs
npm install node
npm install mqtt --save
npm i dotenv
mv .env.local .env

npm install mongodb
npm install mongoose 
npm install nodemon
npm install -g nodemon --save-dev

*/
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require('mongoose')
const urlDB = 'mongodb://localhost/Mydb' // databse name is Mydb

// load dotenv to read environment variables
require("dotenv").config(); // this loads the defined variables from .env  npm install dotenv

// template view engine start
app.set("view engine", "ejs");

// Serve Static Files define for css and html inbuild js file
app.use(express.static("public"));

// mongoDB connection
mongoose.connect(urlDB,{useNewUrlParser:true})
const con = mongoose.connection
con.on('open',function(){
  console.log('connected...')
});
app.use(express.json());

//routes
const dashboardRouter = require("./routers/homedashboard");
const deviceServices = require('./services/devices');

app.get("/mqttConnDetails", (req, res) => { /* mqtt://192.168.1.21:9001 ? > ws://127.0.01:9001/mqtt */
  res.send(
    JSON.stringify({
      mqttServer: process.env.MQTT_BROKER,
      mqttTopic: process.env.MQTT_TOPIC,
    })
  );
});

app.use("/home", dashboardRouter);
app.use('/device',deviceServices);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});