import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import connectToContext from '../context';
import COLORS from '../app/constants/colors';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 16,
  },
  work: {
    backgroundColor: COLORS.secondary
  },
  break: {
    backgroundColor: COLORS.primary
  }
});

const RootView = React.memo(({
  children,
  work,
  ...other
}) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView
      style={[styles.root, styles[work ? 'work' : 'break']]}
      {...other}
      behavior="padding"
    >
      {children}
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
));

RootView.propTypes = {
  work: PropTypes.bool.isRequired,
}

export default connectToContext(RootView, ['work']);
