import api from './api';

const workoutService = {
  getWorkouts: async () => {
    const response = await api.get('/workouts');
    return response.data;
  },

  createWorkout: async (workoutData) => {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  },

  updateWorkout: async (id, workoutData) => {
    const response = await api.put(`/workouts/${id}`, workoutData);
    console.log('Service update response: ', response.data);
    return response.data.data || response.data;
  },

  deleteWorkout: async (id) => {
    return await api.delete(`/workouts/${id}`);
  },

  getWorkoutById: async (id) => {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  },
};

export default workoutService;