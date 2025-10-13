import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWorkouts } from '../store/slices/workoutSlice';
import StatCard from '../components/StatCard';
import WeeklyChart from '../components/WeeklyChart';
import {
  calculateWeeklyStats,
  getWorkoutsByType,
  getLast7DaysData,
  calculateRacePrediction,
  formatTime,
} from '../utils/workoutStat';
import { format, parseISO } from 'date-fns';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { workouts = [], loading } = useSelector((state) => state.workouts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    dispatch(fetchWorkouts());
  };

  const stats = calculateWeeklyStats(workouts);
  const workoutsByType = getWorkoutsByType(workouts);
  const weeklyData = getLast7DaysData(workouts);
  const racePredictions = calculateRacePrediction(workouts);

  // Get upcoming planned workouts
  const upcomingWorkouts = workouts
    .filter((w) => w.planned && !w.completed)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome back, {user?.name}!
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Here's your training overview
        </Text>
      </View>

      {/* Weekly Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            title="Workouts"
            value={stats.totalWorkouts}
            icon="🏃"
            color="#6200ee"
          />
          <StatCard
            title="Distance"
            value={stats.totalDistance}
            unit="mi"
            icon="📏"
            color="#050505ff"
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title="Duration"
            value={Math.round(stats.totalDuration / 60)}
            unit="hrs"
            icon="⏱️"
            color="#4caf50"
          />
          <StatCard
            title="Calories"
            value={stats.totalCalories}
            icon="🔥"
            color="#ff5722"
          />
        </View>
      </View>

      {/* Weekly Chart */}
      {workouts.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <WeeklyChart data={weeklyData} title="This Week's Activity (minutes)" />
          </Card.Content>
        </Card>
      )}

      {/* Workout Types */}
      {Object.keys(workoutsByType).length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Workout Types
            </Text>
            <View style={styles.chipContainer}>
              {Object.entries(workoutsByType).map(([type, count]) => {
                // Map workout types to emojis
                const typeEmoji = {
                  run: '🏃',
                  bike: '🚴',
                  swim: '🏊',
                  strength: '💪',
                };
                
                return (
                  <Chip key={type} style={styles.chip}>
                    {typeEmoji[type] || '🏋️'} {type}: {count}
                  </Chip>
                );
              })}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Race Predictions */}
      {racePredictions && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              🎯 Race Predictions
            </Text>
            <Text variant="bodySmall" style={styles.predictionSubtitle}>
              Based on your recent runs
            </Text>
            <View style={styles.predictionsContainer}>
              {Object.entries(racePredictions).map(([distance, time]) => (
                <View key={distance} style={styles.predictionRow}>
                  <Text variant="bodyMedium" style={styles.predictionDistance}>
                    {distance}
                  </Text>
                  <Text variant="titleMedium" style={styles.predictionTime}>
                    {formatTime(time)}
                  </Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Upcoming Workouts */}
      {upcomingWorkouts.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              📅 Upcoming Workouts
            </Text>
            {upcomingWorkouts.map((workout) => (
              <View key={workout.id} style={styles.upcomingWorkout}>
                <Text variant="bodyMedium" style={styles.upcomingTitle}>
                  {workout.title}
                </Text>
                <Text variant="bodySmall" style={styles.upcomingDate}>
                  {format(parseISO(workout.date), 'MMM dd, yyyy')}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {workouts.length === 0 && !loading && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No workouts yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Start logging your workouts to see your stats and progress!
            </Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
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
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#e1bee7',
    marginTop: 4,
  },
  statsContainer: {
    padding: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  predictionSubtitle: {
    color: '#666',
    marginBottom: 16,
  },
  predictionsContainer: {
    marginTop: 8,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  predictionDistance: {
    fontWeight: '600',
  },
  predictionTime: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  upcomingWorkout: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  upcomingTitle: {
    fontWeight: '600',
  },
  upcomingDate: {
    color: '#666',
    marginTop: 2,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptyText: {
    color: '#666',
  },
});