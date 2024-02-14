// Import MQTT service
import { MQTTWSService } from "./mqttWSservice.js";
let htmlString =``;
/*
  Event listeners for any HTML click
*/
// Event listener when page is loaded
window.addEventListener("load", (event) => {
    //htmlString =``;
    fetchDeviceListConnection();
    // Get MQTT Connection
    fetchMQTTConnection();
});
  
// Callback function that will retrieve our latest sensor readings and redraw our Gauge with the latest readings
function updateSensorReadings(jsonResponse) {
    let readData = Number(jsonResponse.weight).toFixed(2);
    updateChairElement(readData);

}

function updateChairElement(readData) {
    let chairDivTag = document.querySelector("#ESP8266D1");
    if(readData > 10.0){ 
      chairDivTag.style = "background-color:red";
      document.querySelector("#W1ESP8266").textContent = readData+"kg";
    }else{ 
      chairDivTag.style = "background-color:green";
      document.querySelector("#W1ESP8266").textContent = "0.0kg"; 
    }
}
function clientUpdate(clientID){
  document.querySelector("#ESP8266").textContent = clientID;
}
function htmlChairElementGenerator(deviceName,deviceIds){
  htmlString = htmlString +
  `<div class="w3-third w3-container w3-margin-bottom" style="background-color:green" id="ESP8266D1">
    <img src="images/chairgreen.jpg" alt="Norway" style="width:100%" class="w3-hover-opacity">
    <div class="w3-container w3-white">
      <h1><b>01</b></h1>
      <h4 id="${deviceName}">${deviceName}</h4>
      <h5 id="${"W"+deviceIds}">0.0kg</h5>
    </div>
  </div> `;
}
/*
  MQTT Message Handling Code
*/

const mqttDisplayStatus = document.querySelector("#mqttstatus");

function onConnect(message) {
  mqttDisplayStatus.textContent = message;
}
function onMessage(topic, message) {
    var stringResponse = message.toString();
    var response = JSON.parse(stringResponse);
    clientUpdate(response.clientID);
    updateSensorReadings(response);
}
  
function onError(error) {
    mqttDisplayStatus.textContent = "Error.";
    mqttDisplayStatus.textContent = error.toString();
}
  
function onClose() {
    mqttDisplayStatus.textContent = "MQTT connection closed";
}

function fetchDeviceListConnection(){
  fetch("/device/devices",{
    method: "GET",
    headers:{
      "Content-type": "application/json; charset=UTF-8",
    },
  })
  .then(function (response){
    return response.json(); 
  })
  .then(function (devices) {
    for(let index = 0; index < devices.length; index++){
      htmlChairElementGenerator(devices[index].name, devices[index].deviceId);
    }
    document.getElementById('deviceList').innerHTML = htmlString;
  })
  .catch((error) => console.error("Error getting Device list DB Connection :", error))
}

function fetchMQTTConnection() {
    fetch("/mqttConnDetails", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        initializeMQTTConnection(data.mqttServer, data.mqttTopic);
      })
      .catch((error) => console.error("Error getting MQTT Connection :", error));
}

function initializeMQTTConnection(mqttServer, mqttTopic) {
  
    console.log(`Initializing connection to :: ${mqttServer}, topic :: ${mqttTopic}`);
    var fnCallbacks = { onConnect, onMessage, onError, onClose };

    var mqttService = new MQTTWSService(mqttServer, fnCallbacks);
    
    mqttService.connect();
    
    mqttService.subscribe(mqttTopic);
}