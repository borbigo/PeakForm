import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import socialService from '../../services/socialService';

export const fetchFeed = createAsyncThunk(
  'social/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await socialService.getFeed();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feed');
    }
  }
);

export const searchUsers = createAsyncThunk(
  'social/searchUsers',
  async (query, { rejectWithValue }) => {
    try {
      const response = await socialService.searchUsers(query);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search users');
    }
  }
);

export const followUser = createAsyncThunk(
  'social/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      await socialService.followUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow user');
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'social/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      await socialService.unfollowUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfollow user');
    }
  }
);

const socialSlice = createSlice({
  name: 'social',
  initialState: {
    feed: [],
    searchResults: [],
    following: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.following.push(action.payload);
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.following = state.following.filter(id => id !== action.payload);
      });
  },
});

export const { clearSearchResults } = socialSlice.actions;
export default socialSlice.reducer;