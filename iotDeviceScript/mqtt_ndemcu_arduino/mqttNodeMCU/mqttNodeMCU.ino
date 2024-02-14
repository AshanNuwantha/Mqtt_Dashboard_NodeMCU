#include <Arduino.h>
#ifdef ESP32
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif
#include <PubSubClient.h>
#include <ArduinoJson.h>
#define LED D0
#define WEIGHT_SENSOR_ADC A0
/*
  Your MQTT Pass Client ID
*/
const String clientID = "1ESP8266"; // device id for mqtt clientID
/*
  Replace the SSID and Password according to your wifi
*/
const char *ssid = "Dassanayake";
const char *password = "077SaN/*";

// Your MQTT broker ID
const char *mqttBroker = "192.168.1.21";
const int mqttPort = 1883;
// MQTT topics
const char *publishTopic = "weightSensor";
const char *subscribeTopic = "sampletopic";

const double constent1g = (50000/1.59);
const double constent1kg = (50/1.59);

WiFiClient espClient;
PubSubClient client(espClient);

// Connect to Wifi
void setup_wifi(){
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
   
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  digitalWrite(LED, HIGH);
}

// Callback function whenever an MQTT message is received
void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  String message;
  for (int i = 0; i < length; i++)
  {
    Serial.print(message += (char)payload[i]);
  }
  Serial.println();
}

void reconnect()
{
  // Loop until we're reconnected
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");

    // Attempt to connect
    if (client.connect(clientID.c_str()))
    {

      Serial.println("connected");
      digitalWrite(LED, HIGH);
      // Subscribe to topic
      // client.subscribe(subscribeTopic);
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      digitalWrite(LED, LOW);
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  pinMode(LED, OUTPUT);
  //WIFI MQTT server LED
  digitalWrite(LED, LOW);
  //LED status low
  Serial.begin(115200);
  // Setup the wifi
  setup_wifi();
  // setup the mqtt server and callback
  client.setServer(mqttBroker, mqttPort);
  client.setCallback(callback);
  
}

void loop() {
  // Listen for mqtt message and reconnect if disconnected
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  double weightRead = ((((analogRead(A0)*3.256)/1024)-1.68)*constent1kg);
  delay(400);
  //  Publish MQTT messages
  char buffer[256];
  StaticJsonDocument<96> doc;
  doc["clientID"] = clientID;
  doc["weight"] = weightRead;
  size_t n = serializeJson(doc, buffer);

  client.publish(publishTopic, buffer, n);

}
