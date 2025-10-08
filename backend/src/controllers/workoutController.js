const prisma = require('../utils/prisma');

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
    });

    res.json(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createWorkout = async (req, res) => {
  try {
    console.log('Creating workout with data: ', req.body);

    const workout = await prisma.workout.create({
      data: {
        ...req.body,
        userId: req.userId,
        date: new Date(req.body.date),
      },
    });

    console.log('Workout created: ', workout);

    // Create activity for feed
    await prisma.activity.create({
      data: {
        userId: req.userId,
        workoutId: workout.id,
        type: workout.completed ? 'workout_completed' : 'workout_planned',
        content: `${workout.type} - ${workout.title}`,
      },
    });

    res.status(201).json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    const workout = await prisma.workout.update({
      where: { id },
      data: {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
      },
    });

    res.json({ data: workout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.workout.delete({
      where: { id },
    });

    res.json({ message: 'Workout deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};