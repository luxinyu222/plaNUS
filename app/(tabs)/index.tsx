import { StyleSheet, SafeAreaView, Text, Dimensions } from 'react-native';
import { useState, useEffect } from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { Login, Signup, Welcome, HomeScreen, Account } from '../screens'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import COLORS from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import React from 'react'; 


const AuthStack = createNativeStackNavigator();
const AppStack = createBottomTabNavigator();
const height = Dimensions.get('window').height;

const AuthNavigator = () => (
  <AuthStack.Navigator initialRouteName='Welcome'>
    <AuthStack.Screen
      options={{
        headerShown: false,
      }}
      name='Welcome'
      component={Welcome}
    />
    <AuthStack.Screen
      name='Login'
      component={Login}
      options={{
        headerShown: false,
      }}
    />
    <AuthStack.Screen
      name='Signup'
      component={Signup}
      options={{
        headerShown: false,
      }}
    />
  </AuthStack.Navigator>
);

type CustomLabelProps = {
  focused: boolean;
  label: string;
};

const CustomLabel: React.FC<CustomLabelProps> = ({ focused, label }) => {
  return (
    <Text style={focused ? styles.focusedLabel : styles.label}>
      {label}
    </Text>
  );
};

const AppNavigator = ({ session }: { session: Session }) => (
  <AppStack.Navigator
      initialRouteName='HomeScreen'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeScreen') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }
          // Return the Ionicons component with the appropriate icon name, size, and color
          return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary, // Active tab label and icon color
        tabBarInactiveTintColor: COLORS.grey, // Inactive tab label and icon color
        tabBarStyle: {
          paddingBottom:0,
          backgroundColor: '#fff', // Background color of the tab bar
          height: height/18, // Height of the tab bar
          borderTopWidth: 0.5, // Border width at the top
          borderTopColor: '#ccc', // Border color at the top
        }
      })}
    >
    <AppStack.Screen
      name='HomeScreen'
      component={HomeScreen}
      options={{
        headerShown: false,
        tabBarLabel: ({ focused }) => (
          <CustomLabel focused={focused} label="Home Page" />
        )
      }}
    />
    <AppStack.Screen
      name='Account'
      options={{
        headerShown: false,
        tabBarLabel: ({ focused }) => (
          <CustomLabel focused={focused} label="Account" />
        )
      }}
    >
      {props => <Account {...props} session={session} />}
    </AppStack.Screen>
  </AppStack.Navigator>
);

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (

    <SafeAreaView style={{flex:1}}>
      {session && session.user ? (
       < AppNavigator session={session as Session} />
      ) : (
        <AuthNavigator />
      )}
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: height/70,
    color: COLORS.grey,
    fontWeight: 'bold'
  },
  focusedLabel: {
    fontSize: height/70,
    color: COLORS.primary,
    fontWeight: 'bold'
  }
});
