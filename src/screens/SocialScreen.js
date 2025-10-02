import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function SocialScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Social Feed</Text>
      <Text>Activity feed coming soon!</Text>
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