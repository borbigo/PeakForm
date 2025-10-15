import api from './api';

const socialService = {
  getFeed: async () => {
    const response = await api.get('/social/feed');
    return response.data;
  },

  searchUsers: async(query) => {
    const response = await api.get('/social/users/search', { params: { query } });
    return response.data;
  },

  followUser: async (userId) => {
    const response = await api.post('/social/follow', { userId });
    return response.data;
  },

  unfollowUser: async (userId) => {
    const response = await api.delete(`/social/unfollow/${userId}`);
    return response.data;
  },

  getFollowing: async () => {
    const response = await api.get('/social/following');
    return response.data;
  },

  getFollowers: async () => {
    const response = await api.get('/social/followers');
    return response.data;
  },
};

export default socialService;