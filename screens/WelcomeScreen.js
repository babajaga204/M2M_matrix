import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    Button,
    StatusBar,
    Platform,
    View,
    SafeAreaView,
    Pressable,
} from 'react-native';

function WelcomeScreen({ navigation }) {
    const serverPath = "mqtt.toytronics.com";
    const serverPort = "8883";

    const [userName, onChangeUserName] = React.useState("idso003");
    const [userPass, onChangeUserPass] = React.useState("NDnkr9mhPQFy6NhH");

    return (
        <SafeAreaView style={styles.container}>
            <View className='flex flex-1 justify-start items-center'>
                <Text className='mt-28'>Username</Text>
                <TextInput
                    className='bg-slate-100 p-3 rounded-xl w-44 mt-4'
                    autoFocus={true}
                    // style={styles.input}
                    onChangeText={onChangeUserName}
                    value={userName}
                />
                <Text className='mt-4'>Password</Text>
                <TextInput
                    className='bg-slate-100 p-3 rounded-xl w-44 mt-4'
                    // style={styles.input}
                    onChangeText={onChangeUserPass}
                    value={userPass}
                    secureTextEntry={true}
                    textContentType="password"
                    autoComplete="password"
                />
                <Pressable
                    // style={styles.butt}
                    className='mt-auto mb-12 p-4 w-44 rounded-4xl bg-slate-900 text-slate-50 items-center rounded-3xl'
                    title="Connect"
                    onPress={() =>
                        navigation.navigate("SecondPage", {
                            serverPath: serverPath,
                            serverPort: serverPort,
                            userName: userName,
                            userPass: userPass,
                        })
                    }
                >
                    <Text className='text-slate-50'>Connect</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

function checkUsername(props) {
    console.log("hello WORLD!!!!")
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    pads: {
        flex: 1,
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingTop: "10%",
    },
    input: {
        backgroundColor: "white",
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    butt: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        borderRadius: 20,
        borderColor: "#CCC",
        borderWidth: 2,
        backgroundColor: "#FFF",
    },
});

export default WelcomeScreen;