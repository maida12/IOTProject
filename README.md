# Task 
I need to develop a prototype but complete IoT system with following components
- A sensor board like Arduino or Single Board Computer (SBC) like Raspberry Pi. The board should
collect data using at least 2 sensors. Collected data should be transmitted wirelessly using WiFi,
Bluetooth, ZigBee, NFC or similar.
- An edge device that receives wireless data. It could be a computer, a smartphone or another
SBC. Edge device will process and filter the data, as needed, and upload to cloud using MQTT
protocol.
- A private MQTT broker from any service provider.
- A front end for users in the form of a web app or mobile app. It will provide a dashboard for
monitoring and controlling the IoT system. The front-end will NOT communicate with the sensors
or the edge device directly, but via the cloud broker.
Depending on the project, I will also need actuator(s) like LED, LCD display, servo, DC motors.
These can be attached to the same sensor board, and will get commands from the edge device.
In addition, I may utilize a cloud service to perform AI/ML tasks, if any.


## Project Introduction
In the realm of IoT (Internet of Things), the innovative integration of sensors with internet-connected devices offers unparalleled opportunities for monitoring and managing environmental conditions in real-time. This project proposes the development of an IoT-based water management system utilizing an ESP module coupled with a sonar sensor and a temperature sensor. The primary objective is to measure and monitor the water level and temperature within a water tank. Leveraging the capabilities of ESP8266 or ESP32 for wireless communication. The system will provide continuous data transmission to a user-friendly interface, ensuring efficient water resource management and temperature regulation.

## Project Goals
The overarching goals of this project include:

- To accurately measure the water level in a tank using an ultrasonic (sonar) sensor and the water temperature using a DS18B20 sensor.
- Implement real-time monitoring of water level and temperature, allowing for immediate data access and historical data analysis.
- Develop a notification system to alert users about critical water levels or temperature thresholds being reached, enabling prompt action.
- Design the system with a focus on energy efficiency, incorporating power-saving modes to extend the lifespan of any battery-operated components.
- Create an intuitive and accessible user interface on a web or mobile platform, where users can view real-time data, receive notifications, and manage system settings.
- Ensure the system is scalable and flexible, capable of being expanded or adapted to different types of tanks or environmental conditions.


## Applications
This smart water system can be super useful in a lot of ways:
- At Home
Helps homeowners in monitoring and managing water usage, preventing overflows, and ensuring water tanks are adequately filled.
- Agriculture
Vital for managing water resources in irrigation, providing precise control over water distribution based on crop requirements and environmental conditions.
- Industrial Use
Applicable in industries where water use is critical, such as in cooling processes, ensuring water levels and temperatures are maintained within specified parameters.
- Fish Farms
Enables monitoring of water conditions in fish farming, crucial for the health and growth of aquatic life.
- Smart Cities
Can be integrated into smart city infrastructure to optimize water storage and distribution, contributing to sustainable urban development.
## Block Diagram:
For now, as in tinkercad, there was not an option for ESP which we are actually going to use for the WIFI facility, we have used UNO here. Below is just a starting diagram for an idea.


![Screenshot 2024-05-20 173744](https://github.com/maida12/IOTProject/assets/81500487/8f01531f-ec36-4688-8552-6c3093ef962d)

![Screenshot 2024-05-20 173758](https://github.com/maida12/IOTProject/assets/81500487/66279d92-0c83-4b03-922c-ef07375abc55)

## Our Hardware 
<img src="https://github.com/maida12/IOTProject/assets/81500487/4db498c7-405d-4c45-bcf5-d45f766c2b4a" alt="drawing"  height="600"/>



## Code:
Below is the code for the above diagram which will get modified as we will proceed further.

```
const int TRIG_PIN = 7; // Sonar trigger pin
const int ECHO_PIN = 7; // Sonar echo pin
const int BUZZER_PIN = 5; // Buzzer pin (connect to any digital pin)
const float SONAR_MIN_DISTANCE_CM = 150.0; // Minimum distance for sonar warning in centimeters
const float TEMP_THRESHOLD_C = 30.0; // Temperature threshold in Celsius

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
}


int inches = 0;

int cm = 0;

long readUltrasonicDistance(int triggerPin, int echoPin)
{
  pinMode(triggerPin, OUTPUT);  // Clear the trigger
  digitalWrite(triggerPin, LOW);
  delayMicroseconds(2);
  // Sets the trigger pin to HIGH state for 10 microseconds
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triggerPin, LOW);
  pinMode(echoPin, INPUT);
  // Reads the echo pin, and returns the sound wave travel time in microseconds
  return pulseIn(echoPin, HIGH);
}


void loop() {
  // measure the ping time in cm
  cm = 0.01723 * readUltrasonicDistance(7, 7);
  // convert to inches by dividing by 2.54
  inches = (cm / 2.54);
  Serial.print(inches);
  Serial.print("in, ");
  Serial.print(cm);
  Serial.println("cm");
  

  // Read temperature from TMP36 sensor
  int adcVal = analogRead(A0);
  float voltage = adcVal * (5.0 / 1024.0);
  float tempC = (voltage - 0.5) * 100;

  // Check sonar warning
  if (cm < SONAR_MIN_DISTANCE_CM) {
    digitalWrite(BUZZER_PIN, HIGH); // Activate the buzzer
  }else{ // Buzzer on for 1 second
    digitalWrite(BUZZER_PIN, LOW); // Turn off the buzzer
  }

  // Check temperature warning
  if (tempC > TEMP_THRESHOLD_C) {
    digitalWrite(LED_BUILTIN, HIGH); // Turn on the LED (built-in LED on most Arduino boards)
  } else {
    digitalWrite(LED_BUILTIN, LOW); // Turn off the LED
  }


  delay(100);
}

```


### Hardware Requirements
- ESP Module:ESP32-DevKitC 
- Sonar Sensor for Water Level Measurement:HC-SR04 Ultrasonic Sensor 
- Temperature Sensor for Water Temperature Measurement: DS18B20 Waterproof Digital Temperature Sensor 
- Power Supply
- Resistors:4.7kΩ 
- Breadboard and Jumper Wires
