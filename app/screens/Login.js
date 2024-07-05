import { View, Text, Image, Pressable, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, AppState } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Button from '../../components/Button';
import PropTypes from 'prop-types'; 
import { supabase } from '../lib/supabase'

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })

const Login = ({ navigation }) => {
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 22 }}>
                    <Text style={{
                        fontSize: height/30,
                        fontWeight: 'bold',
                        marginVertical: height/80,
                        color: COLORS.black
                    }}>
                        Welcome back with us!
                    </Text>

                    <Text style={{
                        fontSize: height/58,
                        color: COLORS.black
                    }}>Your friend is waiting for you to progress together...</Text>
                </View>

                <View style={{ marginBottom: 12 }}>
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
                            placeholderTextColor={COLORS.grey}
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
                        marginVertical: height/80
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
                            placeholderTextColor={COLORS.grey}
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
                                    <Ionicons name="eye-off" size={height/40} color={COLORS.grey} />
                                ) : (
                                    <Ionicons name="eye" size={height/40} color={COLORS.black} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>

                <Button
                    title="Log in"
                    filled
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                        fontSize: height/55
                    }}
                    disabled={loading}
                    onPress={() => signInWithEmail()}
                />


                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: height/55
                }}>
                    <Text style={{ fontSize: height/55, color: COLORS.black }}>Don't have an account yet?</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Signup")}
                    >
                        <Text style={{
                            fontSize: height/55,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Register</Text>
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

Login.propTypes = {
    navigation: PropTypes.object.isRequired, // Ensure navigation prop is provided and is an object
};

export default Login

const styles = StyleSheet.create({
    image: {
        bottom: 0,
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height/3,
        marginLeft: 0,
        position: 'absolute'
    }
})

