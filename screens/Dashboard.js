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
  SafeAreaView,
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
  const [redValue, setRedValue] = useState(100);
  const [greenValue, setGreenValue] = useState(100);
  const [blueValue, setBlueValue] = useState(100);
  return (
    <SafeAreaView className='bg-slate-700 h-full pt-0'>
      <View className='flex flex-1 justify-start items-center bg-slate-700'>
        <Image resizeMode='contain' className='h-64 w-full mt-0 mb-0 opacity-5 scale-75 tanslate-y-[-20]' source={require("../assets/nTeater.png")} />
        <TextInput
          className='w-9/12 rounded-xl bg-slate-200 p-4 mt-0'
          // style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="Text to display on matrix"
        />
        <View
          // style={styles.sliderStyle}
          className='mt-8 w-full px-8'>
          <View className='flex flex-row items-center'>
            <Slider
              style={{ width: 250, height: 40 }}
              minimumValue={0}
              maximumValue={255}
              step={1}
              value={redValue}
              onValueChange={(redValue) => setRedValue(redValue)}
            />
            <Text className='text-slate-50 ml-4'>R: {redValue}</Text>
          </View>
          <View className='flex flex-row items-center'>
            <Slider
              style={{ width: 250, height: 40 }}
              minimumValue={0}
              maximumValue={255}
              step={1}
              value={greenValue}
              onValueChange={(greenValue) => setGreenValue(greenValue)}
            />
            <Text className='text-slate-50 ml-4'>G: {greenValue}</Text>
          </View>
          <View className='flex flex-row items-center'>
            <Slider
              style={{ width: 250, height: 40 }}
              minimumValue={0}
              maximumValue={255}
              step={1}
              value={blueValue}
              onValueChange={(blueValue) => setBlueValue(blueValue)}
            />
            <Text className='text-slate-50 ml-4'>B: {blueValue}</Text>
          </View>
          <View className='mt-8 flex flex-row justify-between'>
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
            <Button title='Images' onPress={() => { console.log(blueValue, redValue, greenValue) }}
            />
          </View>
        </View>
      </View >
    </SafeAreaView>
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
    // alignItems: "center",
    backgroundColor: "#263238",
  },
  image: {
    opacity: 0.06,
    height: 400,
    width: 400,
  },
  textInput: {
    border: 1,
    borderColor: "dodgerblue",
  },
  input: {
    width: 100,
    height: 40,
    borderWidth: 1,
  },
  // sliderStyle: {
  //   flex: 1,
  // },
});

export default Dashboard;
