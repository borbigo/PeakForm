const prisma = require('../utils/prisma').default;

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
    });

    res.json({ data: workouts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createWorkout = async (req, res) => {
  try {
    const workout = await prisma.workout.create({
      data: {
        ...req.body,
        userId: req.userId,
        date: new Date(req.body.date),
      },
    });

    // Create activity for feed
    await prisma.activity.create({
      data: {
        userId: req.userId,
        workoutId: workout.id,
        type: workout.completed ? 'workout_completed' : 'workout_planned',
        content: `${workout.type} - ${workout.title}`,
      },
    });

    res.status(201).json({ data: workout });
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