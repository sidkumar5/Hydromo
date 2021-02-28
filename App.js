import React from 'react';
import { StyleSheet, Text, } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from "./components/Main.js";
import Add from "./components/Add.js";
import Look from "./components/Look";



const RootStack =  createAppContainer(
    createStackNavigator(
        {
            Mains: Main,
            Adds: Add,
            Edits: Look,


        },
        {
            initialRouteName: 'Mains',
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#777777',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            },
        },
    ),
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});