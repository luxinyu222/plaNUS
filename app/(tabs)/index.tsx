import { Image, StyleSheet, Platform } from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { Login, Signup, Welcome, Main } from '../screens'

const Stack = createNativeStackNavigator()

export default function App() {
  return (

    <Stack.Navigator
      initialRouteName='Welcome'>
        <Stack.Screen
        options = {{
          headerShown: false
        }}
        name = 'Welcome'
        component={Welcome}
        />
        <Stack.Screen
          name = "Login"
          component = {Login}
          options = {{
            headerShown: false
          }}
        />
        <Stack.Screen
          name = 'Signup'
          component = {Signup}
          options = {{
            headerShown: false
          }}
        />
        <Stack.Screen
          name = "Main"
          component= {Main}
          options = {{
            headerShown: false
          }}
        />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({

});
