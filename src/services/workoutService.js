import api from './api';

const workoutService = {
  getWorkouts: async () => {
    return await api.get('/workouts');
  },

  createWorkout: async (workoutData) => {
    return await api.post('/workouts', workoutData);
  },

  updateWorkout: async (id, workoutData) => {
    return await api.put(`/workouts/${id}`, workoutData);
  },

  deleteWorkout: async (id) => {
    return await api.delete(`/workouts/${id}`);
  },

  getWorkoutById: async (id) => {
    return await api.get(`/workouts/${id}`);
  },
};

export default workoutService;