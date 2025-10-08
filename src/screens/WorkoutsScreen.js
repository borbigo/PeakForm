import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, FAB, Card, Chip } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWorkouts } from '../store/slices/workoutSlice';
import { format } from 'date-fns';

export default function WorkoutsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { workouts= [], loading } = useSelector((state) => state.workouts);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = () => {
    dispatch(fetchWorkouts());
  };

  const renderWorkout = ({ item }) => {
    let workoutDate;
    try {
      workoutDate = new Date(item.date);
      //check valid date
      if (isNaN(workoutDate.getTime())) {
        workoutDate = new Date(); // default to current date
      } 
    } catch (error) {
      workoutDate = new Date();
    }
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.title}>
              {item.title}
            </Text>
            <Chip
              mode="outlined"
              style={item.completed ? styles.completedChip : styles.plannedChip}
            >
              {item.completed ? 'Completed' : 'Planned'}
            </Chip>
          </View>
          
          <Text variant="bodySmall" style={styles.date}>
            {format(workoutDate, 'MMM dd, yyyy')}
          </Text>
          
          <View style={styles.typeContainer}>
            <Chip icon="run" compact>
              {item.type}
            </Chip>
          </View>

          {item.description && (
            <Text variant="bodyMedium" style={styles.description}>
              {item.description}
            </Text>
          )}

          <View style={styles.metrics}>
            {item.duration && (
              <Text key={`${item.id}-duration`} variant="bodySmall" style={styles.metric}>
                ⏱️ {item.duration} min
              </Text>
            )}
            {item.distance && (
              <Text key={`${item.id}-distance`} variant="bodySmall" style={styles.metric}>
                📏 {item.distance} km
              </Text>
            )}
            {item.elevation && (
              <Text key={`${item.id}-elevation`} variant="bodySmall" style={styles.metric}>
                ⛰️ {item.elevation} m
              </Text>
            )}
            {item.avgHeartRate && (
              <Text kkey={`${item.id}-heartrate`} variant="bodySmall" style={styles.metric}>
                ❤️ {item.avgHeartRate} bpm
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Workouts
        </Text>
      </View>

      {workouts.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium" style={styles.emptyText}>
            No workouts yet
          </Text>
          <Text variant="bodyMedium" style={styles.emptySubtext}>
            Tap the + button to log your first workout
          </Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          renderItem={renderWorkout}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadWorkouts} />
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddWorkout')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#6200ee',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  date: {
    color: '#666',
    marginBottom: 8,
  },
  typeContainer: {
    marginBottom: 8,
  },
  description: {
    marginTop: 8,
    marginBottom: 8,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  metric: {
    marginRight: 16,
    marginTop: 4,
  },
  completedChip: {
    backgroundColor: '#e8f5e9',
  },
  plannedChip: {
    backgroundColor: '#fff3e0',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginBottom: 8,
    color: '#666',
  },
  emptySubtext: {
    color: '#999',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});