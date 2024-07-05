import React from 'react';
import { View, Text, Image, SafeAreaView, Pressable, Dimensions } from 'react-native';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';
import Button from '../../components/Button';

const Welcome = ({ navigation }) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    return (
        <LinearGradient
            style={{
                flex: 1
            }}
            colors={[COLORS.secondary, COLORS.primary]}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <Image
                        source={require('../../assets/images/thinkingGirl.jpg')}
                        style={{
                            height: Dimensions.get('window').height / 10,
                            width: height / 10,
                            borderRadius: 20,
                            position: 'absolute',
                            top: height / 100,
                            left: width / 30,
                            transform: [
                                { translateX: width / 22.5 },
                                { translateY: height / 20 },
                                { rotate: '-15deg' }
                            ]
                        }}
                    />

                    <Image
                        source={require('../../assets/images/bookGirl.jpg')}
                        style={{
                            height: height / 9,
                            width: height / 9,
                            borderRadius: 20,
                            position: 'absolute',
                            top: height / 40,
                            left: width / 2.7,
                            transform: [
                                { rotate: '-5deg' }
                            ]
                        }}
                    />

                    <Image
                        source={require('../../assets/images/musicBoy.jpg')}
                        style={{
                            height: height / 9,
                            width: height / 9,
                            borderRadius: 20,
                            position: 'absolute',
                            top: height / 5,
                            left: width / 20,
                            transform: [
                                { rotate: '15deg' }
                            ]
                        }}
                    />

                    <Image
                        source={require('../../assets/images/helloGirl.jpg')}
                        style={{
                            height: height / 4.5,
                            width: height / 4.5,
                            borderRadius: 20,
                            position: 'absolute',
                            top: height / 6,
                            left: width / 2.5,
                            transform: [
                                { rotate: '-15deg' }
                            ]
                        }}
                    />
                </View>

                <View style={{
                    paddingHorizontal: 22,
                    position: 'absolute',
                    top: height / 2.15,
                    width: '100%'
                }}>
                    <Text style={{
                        fontSize: height / 18,
                        fontWeight: '800',
                        color: COLORS.white
                    }}>Start your </Text>
                    <Text style={{
                        fontSize: height / 18,
                        fontWeight: '800',
                        color: COLORS.white
                    }}>Journey with</Text>
                    <Text style={{
                        fontSize: height / 18,
                        fontWeight: '800',
                        color: COLORS.white
                    }}>plaNUS !</Text>

                    <View style={{ marginVertical: height / 55 }}>
                        <Text style={{
                            fontSize: height / 55,
                            fontWeight: '600',
                            color: COLORS.white,
                            marginVertical: 4
                        }}>Plan today, thrive tomorrow</Text>
                        <Text style={{
                            fontSize: height / 55,
                            fontWeight: '600',
                            color: COLORS.white,
                            marginVertical: 4
                        }}>Have every day in NUS well organized</Text>
                    </View>

                    <Button
                        title='Join now'
                        onPress={() => navigation.navigate('Signup')}
                        style={{
                            height: height / 15,
                            marginTop: height / 200,
                            width: '100%',
                            fontSize: height / 50
                        }}
                    />

                    <View style={{
                        flexDirection: 'row',
                        marginTop: height / 100,
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            fontSize: height / 55,
                            color: COLORS.white
                        }}>Already have an account?</Text>
                        <Pressable
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={{
                                fontSize: height / 55,
                                color: COLORS.white,
                                fontWeight: 'bold',
                                marginLeft: 4
                            }}>Login</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

Welcome.propTypes = {
    navigation: PropTypes.object.isRequired, // Ensure navigation prop is provided and is an object
};

export default Welcome;
