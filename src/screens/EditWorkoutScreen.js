import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView, 
  Platform,
  Alert,
} from 'react-native';
import { TextInput, Button, Text, SegmentedButtons } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateWorkout, deleteWorkout } from '../store/slices/workoutSlice';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditWorkoutScreen({ route, navigation }) {
  const { workout } = route.params;
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.workouts);

  const [workoutType, setWorkoutType] = useState(workout.type);
  const [title, setTitle] = useState(workout.title);
  const [description, setDescription] = useState(workout.description || '');
  const [date, setDate] = useState(new Date(workout.date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState(workout.duration?.toString() || '');
  const [distance, setDistance] = useState(workout.distance?.toString() || '');
  const [elevation, setElevation] = useState(workout.elevation?.toString() || '');
  const [avgHeartRate, setAvgHeartRate] = useState(workout.avgHeartRate?.toString() || '');
  const [calories, setCalories] = useState(workout.calories?.toString() || '');
  const [completed, setCompleted] = useState(workout.completed ? 'completed' : 'planned');

  const handleUpdate = async () => {
    console.log('=== UPDATE BUTTON PRESSED ===');
    
    if (!title) {
      alert('Please enter a workout title');
      return;
    }

    const workoutData = {
      type: workoutType,
      title,
      description: description || null,
      date: date.toISOString(),
      duration: duration ? parseInt(duration) : null,
      distance: distance ? parseFloat(distance) : null,
      elevation: elevation ? parseFloat(elevation) : null,
      avgHeartRate: avgHeartRate ? parseInt(avgHeartRate) : null,
      calories: calories ? parseInt(calories) : null,
      completed: completed === 'completed',
      planned: completed === 'planned',
    };

    console.log('Workout ID:', workout.id);
    console.log('Workout Data:', workoutData);

    try {
      console.log('Dispatching updateWorkout...');
      const result = await dispatch(updateWorkout({ id: workout.id, workoutData })).unwrap();
      console.log('Update successful:', result);
      navigation.goBack();
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update workout: ' + error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteWorkout(workout.id)).unwrap();
              navigation.goBack();
            } catch (error) {
              alert('Failed to delete workout: ' + error);
            }
          },
        },
      ]
    );
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.header}>
            Edit Workout
          </Text>

          <Text variant="labelLarge" style={styles.label}>
            Workout Type
          </Text>
          <SegmentedButtons
            value={workoutType}
            onValueChange={setWorkoutType}
            buttons={[
              { value: 'run', label: 'Run' },
              { value: 'bike', label: 'Bike' },
              { value: 'swim', label: 'Swim' },
              { value: 'strength', label: 'Strength' },
            ]}
            style={styles.segmented}
          />

          <Text variant="labelLarge" style={styles.label}>
            Status
          </Text>
          <SegmentedButtons
            value={completed}
            onValueChange={setCompleted}
            buttons={[
              { value: 'completed', label: 'Completed' },
              { value: 'planned', label: 'Planned' },
            ]}
            style={styles.segmented}
          />

          <TextInput
            label="Title *"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            Date: {date.toLocaleDateString()}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <TextInput
            label="Duration (minutes)"
            value={duration}
            onChangeText={setDuration}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Distance (mi)"
            value={distance}
            onChangeText={setDistance}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <TextInput
            label="Elevation Gain (m)"
            value={elevation}
            onChangeText={setElevation}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Avg Heart Rate (bpm)"
            value={avgHeartRate}
            onChangeText={setAvgHeartRate}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Calories"
            value={calories}
            onChangeText={setCalories}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleUpdate}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          >
            Update Workout
          </Button>

          <Button
            mode="outlined"
            onPress={handleDelete}
            disabled={loading}
            style={styles.deleteButton}
            buttonColor="#fff"
            textColor="#d32f2f"
          >
            Delete Workout
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
  },
  segmented: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 6,
  },
  deleteButton: {
    marginTop: 12,
    paddingVertical: 6,
    borderColor: '#d32f2f',
  },
  cancelButton: {
    marginTop: 8,
  },
});