import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function WorkoutsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Workouts</Text>
      <Text>Calendar and workout list coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
});