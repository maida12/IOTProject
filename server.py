import paho.mqtt.client as mqtt
import base64
import json
from pymongo import MongoClient

# MQTT broker details
broker_address = "broker.mqttdashboard.com"
broker_port = 1883
keepalive = 60
clientid = "subscriber"
username = ""
password = ""
topic = "fatimasiddiqui/iotproject"

cliente = MongoClient('mongodb://orthoimplantsgu:pakistan@ac-cpo8knv-shard-00-00.eegqz25.mongodb.net:27017,ac-cpo8knv-shard-00-01.eegqz25.mongodb.net:27017,ac-cpo8knv-shard-00-02.eegqz25.mongodb.net:27017/?ssl=true&replicaSet=atlas-4i34th-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0')
# cliente = MongoClient('mongodb+srv://orthoimplantsgu:pakistan@cluster0.eegqz25.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = cliente['IOT']

collection = db['Project']

# Callback function for when the client connects to the broker
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    # Subscribe to the topic
    client.subscribe(topic,qos=2)
    print("Subscribed to topic:", topic)

# Callback function for when a message is received
def on_message(client, userdata, message):
    print("Message received on topic:", message.topic)
    # Decode the received data (assuming it's base64 encoded)
    received_data = message.payload

    try:
        data = json.loads(received_data)
    except json.JSONDecodeError:
        print("Error parsing JSON data.")
        return
    
    # Print the received data
    print("Received data:", data)
    print("Received data:", data.get('distance'), data.get('temperature'))

    document = {
        "topic": message.topic,
        "distance": data.get('distance'),
        "temperature": data.get('temperature'),
    }
    
    # Insert the document into the MongoDB collection
    collection.insert_one(document)
    print("Data inserted into MongoDB")

# Create an MQTT client instance
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)

# Assign callbacks
client.on_connect = on_connect
client.on_message = on_message

# Connect to the broker
client.username_pw_set(username, password)
client.connect(broker_address, broker_port, keepalive)

# Loop start
client.loop_forever()