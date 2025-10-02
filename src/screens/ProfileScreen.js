import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Profile
      </Text>
      <Text variant="bodyLarge" style={styles.name}>
        {user?.name || 'User'}
      </Text>
      <Text variant="bodyMedium" style={styles.email}>
        {user?.email}
      </Text>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        Logout
      </Button>
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
  title: {
    marginBottom: 24,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    color: '#666',
    marginBottom: 32,
  },
  logoutButton: {
    marginTop: 16,
  },
});