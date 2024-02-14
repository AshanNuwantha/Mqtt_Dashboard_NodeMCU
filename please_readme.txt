install : database server of mongodb 7.0.5
install : MQTT server of  mosquitto-2.0.18
install : MQTTX-1.9.8-x64   (MQTT broker request/responce moniter)
install : postman http request/responce application

after that install mosquitto mqtt server then add  "mosquitto.conf" file , into mosquitto install location


dashboard page url:

http://localhost:8080/home

my port : 8080


////-------------postman----------------------////
post request:

http://localhost:8080/device/add

request body JSON :

{
    "name":"ESP8266",
    "deviceId":"4ESP8266"
}

get request :

http://localhost:8080/device/list
