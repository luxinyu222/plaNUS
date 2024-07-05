import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import COLORS from '../app/constants/colors'
import PropTypes from 'prop-types'; 

const Button = (props) => {
    const filledBgColor = props.color || COLORS.primary;
    const outlinedColor = COLORS.white;
    const bgColor = props.filled ? filledBgColor : outlinedColor;
    const textColor = props.filled ? COLORS.white : COLORS.primary;

    return (
        <TouchableOpacity
            style={{
                ...styles.button,
                ...{ backgroundColor: bgColor },
                ...props.style
            }}
            onPress={props.onPress}
        >
            <Text style={{ fontSize: props.style.fontSize, fontWeight: 600, ... { color: textColor } }}>{props.title}</Text>
        </TouchableOpacity>
    )
}

Button.propTypes = {
    disabled: PropTypes.bool,
    color: PropTypes.string, // Optional prop: color as string
    filled: PropTypes.bool, // Required prop: filled as boolean
    style: PropTypes.object, // Optional prop: style as object
    onPress: PropTypes.func.isRequired, // Required prop: onPress as function
    title: PropTypes.string.isRequired, // Required prop: title as string
}; 

const styles = StyleSheet.create({
    button: {
        paddingBottom: 16,
        paddingVertical: 10,
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default Button