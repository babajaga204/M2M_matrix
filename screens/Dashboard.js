import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  Button,
  Platform,
  StatusBar,
} from "react-native";
import Slider from "@react-native-community/slider";
import MQTT from "@openrc/react-native-mqtt";

let MqttClient;
let messageLog;

function Dashboard({ navigation, route }) {
  const [status, setStatus] = React.useState([""]);
  const [subscribed, setSubscribed] = React.useState(false);
  const [currentMessage, setMessageText] = React.useState("");

  React.useEffect(() => {
    navigation.addListener("focus", () => {
      console.log("focus");
      connectAndSubscribe();
    });

    navigation.addListener("blur", () => {
      console.log("blur " + MqttClient);
      unsubscribe();
    });
  }, [navigation]);

  const unsubscribe = () => {
    if (MqttClient && subscribed) {
      MqttClient.unsubscribe(
        "presence/" + route.params.userName,
        function (err) {
          if (!err) {
            console.log("Unsubscribe error " + err);
          }
          MqttClient.end();
        }
      );
    }
    setSubscribed(false);
  };

  const handleMessage = (topic, message) => {
    console.log("message to " + topic + ": " + message);
    const newMessage = topic + ": " + message + "\n";
    setMessageText((prevText) => [newMessage, ...prevText]);
  };

  const connectAndSubscribe = () => {
    console.log("connecting");
    setStatus("Connecting");
    MqttClient = MQTT.connect("ws://" + route.params.serverPath + "/mqtt", {
      port: route.params.serverPort,
      protocol: "ws",
      username: route.params.userName,
      password: route.params.userPass,
      reconnectPeriod: 30 * 1000,
      qos: 2,
    });

    MqttClient.on("closed", function () {
      setStatus("Disconnected");
    });

    MqttClient.on("offline", function () {
      setStatus("Offline");
    });

    MqttClient.on("error", function (msg) {
      setStatus("Error: " + msg);
    });

    MqttClient.on("disconnect", function (msg) {
      setStatus("disconnect");
    });

    MqttClient.on("reconnect", function (msg) {
      setStatus("reconnect");
    });

    MqttClient.on("connect", function () {
      console.log("connected");
      setStatus("Connected");
      MqttClient.subscribe("presence/" + route.params.userName, function (err) {
        if (!err) {
          setSubscribed(true);
          MqttClient.publish("presence/" + route.params.userName, "alive");
        }
      });
    });

    MqttClient.on("message", function (topic, message) {
      handleMessage(topic, message);
    });
  };

  const [text, onChangeText] = React.useState("Text to display on matrix");
  const [number, onChangeNumber] = React.useState(null);
  const [redValue, setRedValue] = useState("50%");
  const [greenValue, setGreenValue] = useState("50%");
  const [blueValue, setBlueValue] = useState("50%");
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/nTeater.png")} />
      <View style={styles.textInput}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="Text to display on matrix"
        />
      </View>
      <View style={styles.sliderStyle}>
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={0}
          maximumValue={255}
          step={1}
          value={redValue}
          onValueChange={(redValue) => setRedValue(redValue)}
        />
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={0}
          maximumValue={255}
          step={1}
          value={greenValue}
          onValueChange={(greenValue) => setGreenValue(greenValue)}
        />
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={0}
          maximumValue={255}
          step={1}
          value={blueValue}
          onValueChange={(blueValue) => setBlueValue(blueValue)}
        />
        <Button
          title="Upload text"
          onPress={() =>
            publishToMqtt(
              "public/test",
              text.toString(),
              redValue.toString(),
              greenValue.toString(),
              blueValue.toString()
            )
          }
        />
      </View>
    </View>
  );
}

function publishToMqtt(topic, msg, r, g, b) {
  MqttClient.publish("public/test/rgb_1", r);
  MqttClient.publish("public/test/rgb_2", g);
  MqttClient.publish("public/test/rgb_3", b);
  MqttClient.publish(topic, msg);

  //handleMessage(MqttClient.publish("presence/" + route.params.userName, "test"))
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#263238",
  },
  image: {
    opacity: 0.06,
  },
  textInput: {
    border: 1,
    borderColor: "dodgerblue",
  },
  input: {
    width: 100,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  sliderStyle: {
    flex: 1,
  },
});

export default Dashboard;
