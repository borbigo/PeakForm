const prisma = require('../utils/prisma');

exports.getActivityFeed = async (req, res) => {
  try {
    //get users that curr user follows
    const following = await prisma.follows.findMany({
      where: { followerId: req.userId },
      select: { followingId: true },
    });

    const followingIds = following.map(f => f.followingId);
    followingIds.push(req.userId); // include own activities

    //get activities from followed users
    const activities = await prisma.activity.findMany({
      where: {
        userId: { in: followingIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        workout: {
          select: {
            id: true,
            type: true,
            title: true,
            duration: true,
            distance: true,
            date: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching feed: ', error);
    res.status(500).json({ message: 'Failed to fetch activity feed' });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    console.log('Search query:', req.query);
    const { query } = req.query;

    if (!query) {
      return res.json([]);
    }

    console.log('Searching for:', query);

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
        NOT: {
          id: req.userId, // exclude curr user - i.e. can't search ourself up
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      take: 20,
    });

    console.log('Found users:', users);
    res.json(users);
  } catch (error) {
    console.error('Error searching users: ', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
};

exports.followUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId === req.userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const follow = await prisma.follows.create({ 
      data: {
        followerId: req.userId,
        followingId: userId,
      },
    });

    res.status(201).json(follow);
  } catch (error) {
    console.error('Error following user: ', error);
    res.status(500).json({ message: 'Failed to follow user' });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.follows.deleteMany({
      where: {
        followerId: req.userId,
        followingId: userId,
      },
    });

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user: ', error);
    res.status(500).json({ message: 'Failed to unfollow user' });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const following = await prisma.follows.findMany({
      where: { followerId: req.userId },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(following);
  } catch (error) {
    console.error('Error fetching following: ', error);
    res.status(500).json({ message: 'Failed to fetch following' });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const followers = await prisma.follows.findMany({
      where: { followingId: req.userId },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(followers);
  } catch (error) {
    console.error('Error fetching followers; ', error);
    res.status(500).json({ message: 'Failed to fetch followers' });
  }
};

