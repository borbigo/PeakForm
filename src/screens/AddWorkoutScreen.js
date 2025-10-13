import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Text, SegmentedButtons } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { createWorkout } from '../store/slices/workoutSlice';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddWorkoutScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.workouts);

  const [workoutType, setWorkoutType] = useState('run');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [elevation, setElevation] = useState('');
  const [avgHeartRate, setAvgHeartRate] = useState('');
  const [calories, setCalories] = useState('');
  const [completed, setCompleted] = useState('completed'); // for planning workouts planned/completed states

  const handleSubmit = async () => {
    if (!title) {
      alert('Please enter a workout title');
      return;
    }

    const workoutData ={
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

    try { 
      await dispatch(createWorkout(workoutData)).unwrap();
      navigation.goBack();
    } catch (error) {
      alert('Failed to create workout: ' + error);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.Os === 'ios' ? 'padding' : 'height'}
      style={styles.container}  
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.header}>
            Log Workout
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
            placeholder="Morning Run"
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
            placeholder="Easy recovery run"
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
            placeholder="45"
          />

          <TextInput
            label="Distance (mi)"
            value={distance}
            onChangeText={setDistance}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.input}
            placeholder="6.5"
          />

          <TextInput
            label="Elevation Gain (m)"
            value={elevation}
            onChangeText={setElevation}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="150"
          />

          <TextInput
            label="Avg Heart Rate (bpm)"
            value={avgHeartRate}
            onChangeText={setAvgHeartRate}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="145"
          />

          <TextInput
            label="Calories"
            value={calories}
            onChangeText={setCalories}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="450"
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          >
            Save Workout
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
  )
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
  cancelButton: {
    marginTop: 8,
  },
});