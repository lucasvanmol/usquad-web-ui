import * as MQTT from 'paho-mqtt';

export class MQTTClient {
    client : MQTT.Client;
    host : string;
    port : number;

    constructor (host: string, port : number, clientID : string, messageArrivedCallback : (message : MQTT.Message) => void, onConnectCallback? : () => void) {
        this.client = new MQTT.Client(host, port, clientID);
        this.host = host;
        this.port = port;

        // Callback handlers
        this.client.onConnectionLost = this._onConnectionLost;
        this.client.onMessageArrived = messageArrivedCallback;

        this.client.connect({
            timeout: 3,
            onSuccess: onConnectCallback || this._onConnect,
            onFailure: this._onFailure,
        });
    }

    _onConnect() {
        console.log("Succesfully Connected");
    }
      
    _onConnectionLost(responseObject : any) {
        if (responseObject.errorCode !== 0) {
          console.log("Connection lost:" + responseObject.errorMessage);
        }
    }

    _onFailure(message : any) {
        console.log("Connection failed: " + message);
    }

    publish(topic : string, payload : string) {
        console.log("Sending message:\nTopic: " + topic +"\nPayload: " + payload);
      
        let message = new MQTT.Message(payload);
        message.destinationName = topic;
      
        this.client.send(message);
    }

    subscribe(topic : string) {
        let subs = document.getElementById('subscriptions');
        subs.innerHTML += "Subscribed to " + topic + "<br />";
      
        this.client.subscribe(topic);
    }
}   