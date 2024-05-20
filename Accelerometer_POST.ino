#include <WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

const char* ssid = "Hi !!!";
const char* password = "30556890";
const char* mqttBroker = "broker.mqttdashboard.com"; // Update with your MQTT broker address
const int mqttPort = 1883;
const char* mqttUser = ""; // If MQTT broker requires authentication
const char* mqttPassword = ""; // If MQTT broker requires authentication
const char* topic = "fatimasiddiqui/iotproject";

#define SONAR_TRIG_PIN 2    // GPIO pin for the Sonar sensor trigger 
#define SONAR_ECHO_PIN 4    // GPIO pin for the Sonar sensor echo
#define ONE_WIRE_BUS 5      // GPIO pin for the DS18B20 temperature sensor

WiFiClient espClient;
PubSubClient client(espClient);

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

void setup() {
    Serial.begin(115200);

    // Connect to WiFi
    WiFi.begin(ssid, password);
    Serial.println("Connecting to WiFi...");

    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }

    Serial.println("\nConnected to WiFi");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    // Start temperature sensor
    tempSensor.begin();
    
    // Initialize Sonar sensor pins
    pinMode(SONAR_TRIG_PIN, OUTPUT);
    pinMode(SONAR_ECHO_PIN, INPUT);

    // Set MQTT broker and callback function
    client.setServer(mqttBroker, mqttPort);
    client.setCallback(callback);

    // Connect to MQTT broker
    reconnect();
}

void loop() {
    // Read distance from Sonar sensor
    float distance = readSonarDistance();
    Serial.print("Distance (cm): ");
    Serial.println(distance);

    // Read temperature from DS18B20 sensor
    tempSensor.requestTemperatures();
    float temperature = tempSensor.getTempCByIndex(0);
    Serial.print("Temperature (C): ");
    Serial.println(temperature);

    // Send data to MQTT topic
    sendDataToMQTT(distance, temperature);

    delay(5000);  // Delay between readings
}

float readSonarDistance() {
    digitalWrite(SONAR_TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(SONAR_TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(SONAR_TRIG_PIN, LOW);

    unsigned long pulseDuration = pulseIn(SONAR_ECHO_PIN, HIGH);
    float distance = pulseDuration * 0.034 / 2;  // Speed of sound = 34 cm/ms
    return distance;
}

void sendDataToMQTT(float distance, float temperature) {
    if (!client.connected()) {
        reconnect();
    }

    // Create JSON payload
    String payload = "{\"distance\": " + String(distance) + ", \"temperature\": " + String(temperature) + "}";

    // Publish data to MQTT topic with QoS level 2
    client.publish(topic, payload.c_str() ); // true specifies QoS level 2
}

void reconnect() {
    while (!client.connected()) {
        Serial.print("Attempting MQTT connection...");
        if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
            Serial.println("connected");
            client.subscribe(topic);
        } else {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}

void callback(char* topic, byte* payload, unsigned int length) {
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    for (int i = 0; i < length; i++) {
        Serial.print((char)payload[i]);
    }
    Serial.println();
}