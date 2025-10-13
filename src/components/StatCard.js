import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function StatCard({ title, value, unit, icon, color = '#5200ee' }) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.content}>
          <Text variant="bodySmall" style={styles.title}>
            {title}
          </Text>
          <View style={styles.valueContainer}>
            {icon && <Text style={[styles.icon, { color }]}>{icon}</Text>}
            <Text variant="headlineMedium" style={[styles.value, { color }]}>
              {value}
            </Text>
            {unit && (
              <Text variant="bodyMedium" style={styles.unit}>
                {unit}
              </Text>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4, 
    elevation: 2,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  icon: {
    fontSize: 20,
    marginRight: 4,
  },
  value: {
    fontWeight: 'bold',
  },
  unit: {
    color: '#666',
    marginLeft: 4,
  },
});