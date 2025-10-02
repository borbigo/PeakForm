import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Dashboard
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Welcome to Peak Training!</Title>
          <Text variant="bodyMedium">
            Your training dashboard will show stats, upcoming workouts, and AI insights here.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>This Week</Title>
          <Text variant="bodyMedium">No workouts logged yet</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#6200ee',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
});