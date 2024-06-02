import { View, Text, Image, SafeAreaView, Pressable } from 'react-native'
import React from 'react'
import COLORS from '../constants/colors'
import {LinearGradient} from 'expo-linear-gradient'
import Button from '../../components/Button'

const Welcome = ( {navigation} ) => {
  return (
    <LinearGradient
        style = {{
            flex: 1
        }}
        colors = {[COLORS.secondary, COLORS.primary]}
    >
        <SafeAreaView style = {{flex: 1}}>
            <View>
            <Image
                  source = {require('../../assets/images/thinkingGirl.jpg')}
                  style = {{
                    height: 100,
                    width: 100,
                    borderRadius: 20,
                    position: 'absolute',
                    top: 10,
                    left: 15,
                    transform: [
                        {translateX: 20},
                        {translateY: 50},
                        {rotate: '-15deg'}
                    ]
                  }}
                />

            <Image
              source = {require('../../assets/images/bookGirl.jpg')}
              style = {{
                height: 100,
                width: 100,
                borderRadius: 20,
                position: 'absolute',
                top: -30,
                left: 110,
                transform: [
                    {translateX: 50},
                    {translateY: 50},
                    {rotate: '-5deg'}
                ]
              }}
              />

            <Image
              source = {require('../../assets/images/musicBoy.jpg')}
              style = {{
                height: 100,
                width: 100,
                borderRadius: 20,
                position: 'absolute',
                top: 130,
                left: -30,
                transform: [
                    {translateX: 50},
                    {translateY: 50},
                    {rotate: '15deg'}
                ]
              }}
              />

            <Image
              source = {require('../../assets/images/helloGirl.jpg')}
              style = {{
                height: 200,
                width: 200,
                borderRadius: 20,
                position: 'absolute',
                top: 110,
                left: 130,
                transform: [
                    {translateX: 50},
                    {translateY: 50},
                    {rotate: '-15deg'}
                ]
              }}
              />
            </View>

            <View style = {{
                paddingHorizontal: 22,
                position: 'absolute',
                top: 450,
                width: '100%'
            }}>
                <Text style = {{
                    fontSize: 50,
                    fontWeight: 800,//the content of bold
                    color: COLORS.white
                }}>Start your </Text>
                <Text style = {{
                    fontSize: 50,
                    fontWeight: 800,//the content of bold
                    color: COLORS.white
                }}>Journey with</Text>
                <Text style = {{
                    fontSize: 50,
                    fontWeight: 800,//the content of bold
                    color: COLORS.white
                }}>plaNUS !</Text>

                <View style = {{marginVertical: 20}}>
                    <Text style = {{
                        fontSize: 16,
                        fontWeight: 600,
                        color: COLORS.white,
                        marginVertical: 4
                    }}>Plan today, thrive tommorow</Text>
                    <Text style = {{
                        fontSize: 16,
                        fontWeight: 600,
                        color: COLORS.white,
                        marginVertical: 4
                    }}>Have everyday in NUS well organized</Text>
                </View>

                <Button
                  title='Join now'
                  onPress = {() => navigation.navigate('Signup')}
                  style = {{
                    height: 60,
                    marginTop: 5,
                    width: '100%'
                  }}
                />

                <View style={{
                    flexDirection: "row",
                    marginTop: 12,
                    justifyContent: "center"
                }}>
                    <Text style={{
                        fontSize: 16,
                        color: COLORS.white
                    }}>Already have an account ?</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.white,
                            fontWeight: "bold",
                            marginLeft: 4
                        }}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    </LinearGradient>
  )
}

export default Welcome