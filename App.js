import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SecondPage from './screens/Dashboard';
import loginPage from './screens/WelcomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="loginPage">
        <Stack.Screen
          name="loginPage"
          component={loginPage}
          options={{
            title: "Login", //Set Header Title
            headerStyle: {
              backgroundColor: "#546E7A", //Set Header color
            },
            headerTintColor: "#fff", //Set Header text color
            headerTitleStyle: {
              fontWeight: "bold", //Set Header text style
            },
          }}
        />
        <Stack.Screen
        name="SecondPage"
        component={SecondPage}
        options={{
          title: "Connect", //Set Header Title
          headerStyle: {
            backgroundColor: "#f4511e", //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
        }}
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

