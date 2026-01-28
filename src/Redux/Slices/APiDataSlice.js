// imageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Make sure your .env has: VITE_UNSPLASH_ACCESS_KEY=your_access_key
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// Async thunk to fetch images
export const fetchImages = createAsyncThunk(
  "images/fetchImages",
  async (query, thunkAPI) => {
    try {
      const res = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query,
          per_page: 12,
        },
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      });
      return res.data.results;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.errors || error.message);
    }
  }
);

const imageSlice = createSlice({
  name: "images",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default imageSlice.reducer;