import { 
  startOfWeek,
  endOfWeek,
  eachDayOfInterval, 
  format, 
  parseISO,
  parse
} from 'date-fns';

export const calculateWeeklyStats = (workouts) => {
  const completedWorkouts = workouts.filter((w) => w.completed);

  //total stats
  const totalWorkouts = completedWorkouts.length;
  const totalDistance = completedWorkouts.reduce((sum, w) => {
    const distance = parseFloat(w.distance) || 0;
    return sum + distance;
  }, 0);
  const totalDuration = completedWorkouts.reduce((sum, w) => {
    const duration = parseInt(w.duration) || 0;
    return sum + duration;
  }, 0);
  const totalCalories = completedWorkouts.reduce((sum, w) => {
    const calories = parseInt(w.calories) || 0;
    return sum + calories;
  }, 0);

  return {
    totalWorkouts,
    totalDistance: totalDistance.toFixed(1),
    totalDuration: Math.round(totalDuration),
    totalCalories: Math.round(totalCalories),
  };
};

export const getWorkoutsByType = (workouts) => {
  const completedWorkouts = workouts.filter((w) => w.completed);
  const typeCount = {};

  completedWorkouts.forEach((workout) => {
    typeCount[workout.type] = (typeCount[workout.type] || 0) + 1;
  });

  return typeCount;
};

export const getLast7DaysData = (workouts) => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); //have week start on Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const labels = daysOfWeek.map((day) => format(day, 'EEE'));
  const data = daysOfWeek.map((day) => {
    const dayStr = format(day, 'yyy-MM-dd');
    return workouts
      .filter((w) => {
        try {
          const workoutDate = format(parseISO(w.date), 'yyy-MM-dd');
          return workoutDate === dayStr && w.completed;
        } catch {
          return false;
        }
      })
      .reduce((sum, w) => sum + (w.duration || 0), 0);
  });

  return {
    labels, 
    datasets: [
      {
        data: data.length > 0 ? data: [0],
      },
    ],
  };
};

export const calculateRacePrediction = (workouts) => {
  // Simple race prediction based on recent runs
  const recentRuns = workouts
    .filter((w) => {
      const isValid = w.type === 'run' && 
                     w.completed && 
                     w.distance && 
                     w.duration && 
                     w.distance > 0 && 
                     w.duration > 0;
      return isValid;
    })
    .slice(0, 10); // Last 10 runs

  console.log('Recent runs for prediction:', recentRuns);

  if (recentRuns.length === 0) {
    return null;
  }

  // Calculate average pace (min/mi)
  const totalPace = recentRuns.reduce((sum, run) => {
    const pace = run.duration / run.distance;
    console.log(`Run: ${run.title}, Distance: ${run.distance}, Duration: ${run.duration}, Pace: ${pace}`);
    return sum + pace;
  }, 0);

  const avgPace = totalPace / recentRuns.length;
  console.log('Average pace (min/mi):', avgPace);

  if (!avgPace || isNaN(avgPace)) {
    return null;
  }

  // Predict race times (rough estimates)
  const predictions = {
    '5K': Math.round(avgPace * 3.1),
    '10K': Math.round(avgPace * 6.2 * 1.05),
    'Half Marathon': Math.round(avgPace * 13.1 * 1.1),
    'Marathon': Math.round(avgPace * 26.2 * 1.15),
  };

  console.log('Race predictions:', predictions);

  return predictions;
};

export const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours === 0) {
    return `${mins}m`;
  }
  return `${hours}h ${mins}m`;
};

