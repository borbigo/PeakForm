import { createSlice } from '@reduxjs/toolkit';

const socialSlice = createSlice({
  name: 'social',
  initialState: {
    feed: [],
    followers: [],
    following: [],
    loading: false,
  },
  reducers: {
    //add later
  },
});

export default socialSlice.reducer;