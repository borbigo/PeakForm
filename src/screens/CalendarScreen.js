import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Chip, FAB } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWorkouts } from '../store/slices/workoutSlice';
import { format, parseISO } from 'date-fns';

export default function CalendarScreen({ navigation }) {
  const dispatch = useDispatch();
  const { workouts = [] } = useSelector((state) => state.workouts);
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    dispatch(fetchWorkouts());
  }, []);

  useEffect(() => {
  //mark dates with workouts
  const marked = {};
  
  workouts.forEach((workout) => {
    try {
      const dateStr = format(parseISO(workout.date), 'yyyy-MM-dd');

      if (!marked[dateStr]) {
        marked[dateStr] = {
          marked: true,
          dots: [],
        };
      }

      // add dot with color based on workout status
      const color = workout.completed ? '#4caf50' : '#ff9800';
      marked[dateStr].dots.push({ color });
    } catch (error) {
      console.error('Error parsing date: ', error);
    }
  });

  // add selection to marked dates
  if (selectedDate) {
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: '#6200ee',
    };
  }
  
  // Only update state if the marked dates actually changed
  const markedString = JSON.stringify(marked);
  const currentString = JSON.stringify(markedDates);
  
  if (markedString !== currentString) {
    setMarkedDates(marked);
  }
}, [workouts, selectedDate]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  //get workouts for selected date
  const selectedWorkouts = workouts.filter((workout) => {
    try {
      const workoutDate = format(parseISO(workout.date), 'yyyy-MM-dd'); // Fixed: 4 y's
      return workoutDate === selectedDate;
    } catch {
      return false;
    }
  });

  const getWorkoutIcon = (type) => {
    const icons = {
      run: '🏃',
      bike: '🚴',
      swim: '🏊',
      strength: '💪',
    };
    return icons[type] || '🏋️';
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Training Calendar
        </Text>
      </View>

      <Calendar
        markedDates={markedDates}
        onDayPress={onDayPress}
        markingType = {'multi-dot'}
        theme={{
          selectedDayBackgroundColor: '#6200ee',
          todayTextColor: '#6200ee',
          dotColor: '#6200ee',
          arrowColor: '#6200ee',
        }}
      />

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#4caf50' }]} />
          <Text variant="bodySmall">Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#ff9800' }]} />
          <Text variant="bodySmall">Planned</Text>
        </View>
      </View>

      <ScrollView style={styles.workoutsList}>
        {selectedDate ? (
          <>
            <Text variant="titleMedium" style={styles.dateTitle}>
              {format(parseISO(selectedDate + 'T00:00:00'), 'MMMM dd, yyyy')}
            </Text>

            {selectedWorkouts.length === 0 ? (
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="bodyMedium" style={styles.noWorkouts}>
                    No workouts on this day
                  </Text>
                </Card.Content>
              </Card>
            ) : (
              selectedWorkouts.map((workout) => (
                <Card key={workout.id} style={styles.card}>
                  <Card.Content>
                    <View style={styles.workoutHeader}>
                      <Text variant="titleMedium">
                        {getWorkoutIcon(workout.type)} {workout.title}
                      </Text>
                      <Chip
                        mode="outlined"
                        style={
                          workout.completed
                            ? styles.completedChip
                            : styles.plannedChip
                        }
                      >
                        {workout.completed ? 'Completed' : 'Planned'}
                      </Chip>
                    </View>

                    {workout.description && (
                      <Text variant="bodyMedium" style={styles.description}>
                        {workout.description}
                      </Text>
                    )}

                    <View style={styles.metrics}>
                      {workout.duration && (
                        <Text variant="bodySmall" style={styles.metric}>
                          ⏱️ {workout.duration} min
                        </Text>
                      )}
                      {workout.distance && (
                        <Text variant="bodySmall" style={styles.metric}>
                          📏 {workout.distance} mi
                        </Text>
                      )}
                      {workout.elevation && (
                        <Text variant="bodySmall" style={styles.metric}>
                          ⛰️ {workout.elevation} m
                        </Text>
                      )}
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </>
        ) : (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="bodyMedium" style={styles.noWorkouts}>
                Select a date to view workouts
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('WorkoutsTab', { screen: 'AddWorkout' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  workoutsList: {
    flex: 1,
    padding: 16,
  },
  dateTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  noWorkouts: {
    textAlign: 'center',
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});