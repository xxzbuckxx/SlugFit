import React from 'react';
import { View, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';

interface CustomCheckBoxProps {
  checked: boolean;
  onPress: (event: GestureResponderEvent) => void;
  disable: boolean;
}

const Checkbox: React.FC<CustomCheckBoxProps> = ({ checked, onPress, disable }) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      className="border-cyan-30 my-auto rounded border bg-transparent p-0.5"
      disabled={disable}
    >
      {checked ? (
        <View style={styles.checkedContainer} />
      ) : (
        <View style={styles.uncheckedContainer} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkedContainer: {
    width: 10,
    height: 10,
    backgroundColor: 'black',
    borderRadius: 2,
  },
  uncheckedContainer: {
    width: 10,
    height: 10,
    backgroundColor: 'transparent',
  },
});

export default Checkbox;
