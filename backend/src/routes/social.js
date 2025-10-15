const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/feed', socialController.getActivityFeed);
router.get('/users/search', socialController.searchUsers);
router.get('/following', socialController.getFollowing);
router.get('/followers', socialController.getFollowers);
router.post('/follow', socialController.followUser);
router.delete('/unfollow/:userId', socialController.unfollowUser);

module.exports = router;