import { View, Text, Image, Pressable, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, AppState } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Button from '../../components/Button';
import { supabase } from '../lib/supabase';
import PropTypes from 'prop-types'; 
import { Input } from '@rneui/themed'

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })

const Signup = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
  
    async function signInWithEmail() {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
  
      if (error) Alert.alert(error.message)
      setLoading(false)
    }
  
    async function signUpWithEmail() {
      setLoading(true)
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
  
      if (error) Alert.alert(error.message)
      if (!session) Alert.alert('Please check your inbox for email verification!')
      setLoading(false)
    }
  

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: height/40 }}>
                    <Text style={{
                        fontSize: height/30,
                        fontWeight: 'bold',
                        marginVertical: height/80,
                        color: COLORS.black
                    }}>
                        Create Account
                    </Text>

                    <Text style={{
                        fontSize: height/58,
                        color: COLORS.black
                    }}>Ready to visualize every plan of yours?</Text>
                </View>

                <View style={{ marginBottom: height/60 }}>
                    <Text style={{
                        fontSize: height/55,
                        fontWeight: 500,
                        marginVertical: height/90
                    }}>Email address</Text>

                    <View style={{
                        width: "100%",
                        height: height/19,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            label="Email"
                            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            autoCapitalize={'none'}
                            placeholder='Enter your email address'
                            placeholderTextColor={COLORS.gray}
                            keyboardType='email-address'
                            style={{
                                width: "100%"
                            }}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: height/55,
                        fontWeight: 500,
                        marginVertical: height/90
                    }}>Password</Text>

                    <View style={{
                        width: "100%",
                        height: height/19,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            label="Password"
                            leftIcon={{ type: 'font-awesome', name: 'lock' }}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            autoCapitalize={'none'}
                            placeholder='Enter your password'
                            placeholderTextColor={COLORS.gray}
                            secureTextEntry={isPasswordShown}
                            style={{
                                width: "100%"
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isPasswordShown == true ? (
                                    <Ionicons name="eye-off" size={height/40} color={COLORS.black} />
                                ) : (
                                    <Ionicons name="eye" size={height/40} color={COLORS.black} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>

                <Button
                    title="Sign Up"
                    filled
                    style={{
                        marginTop: height/55,
                        marginBottom: height/60,
                        fontSize: height/55
                    }}
                    disabled={loading}
                    onPress={() => signUpWithEmail()}
                />


                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: height/300
                }}>
                    <Text style={{ fontSize: height/55, color: COLORS.black }}>Already have an account?</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={{
                            fontSize: height/55,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            marginLeft: width/80
                        }}>Login</Text>
                    </Pressable>
                </View>

            </View>
            <Image
              source={require('@/assets/images/bottomShape.png')}
              style = {styles.image}
            
            />

        </SafeAreaView>
    )
}

Signup.propTypes = {
    navigation: PropTypes.object.isRequired, // Ensure navigation prop is provided and is an object
};

export default Signup

const styles = StyleSheet.create({
    image: {
        bottom: 0,
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height/3,
        marginLeft: 0,
        position: 'absolute'
    }
})

