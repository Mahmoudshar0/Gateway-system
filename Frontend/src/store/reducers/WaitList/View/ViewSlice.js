import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// get All Levels
export const fetchLevels = createAsyncThunk(
  "view-waitlist/fetchLevels",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard/waitlist/levels`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// create a new level
export const createLevel = createAsyncThunk(
  "view-waitlist/createLevel",
  async (level, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/dashboard/waitlist/level/add`,
        level
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || error.response.data
      );
    }
  }
);

// delete a level
export const deleteLevel = createAsyncThunk(
  "view-waitlist/deleteLevel",
  async (levelId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/dashboard/waitlist/level/${levelId}/delete`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || error.response.data
      );
    }
  }
);

// get All Payment Type
export const fetchPaymentType = createAsyncThunk(
  "view-waitlist/fetchPaymentType",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard/waitlist/payments`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// create a new payment type
export const createPaymentType = createAsyncThunk(
  "view-waitlist/createPaymentType",
  async (paymentType, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/dashboard/waitlist/payment/add`,
        paymentType
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || error.response.data
      );
    }
  }
);

// delete a payment type
export const deletePaymentType = createAsyncThunk(
  "view-waitlist/deletePaymentType",
  async (paymentId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/dashboard/waitlist/payment/${paymentId}/delete`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || error.response.data
      );
    }
  }
);

// get All Preferable Time by age_group
export const fetchPreferableTime = createAsyncThunk(
  "view-waitlist/fetchPreferableTime",
  async (age_group, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const params = age_group ? { age_group } : {};
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard/waitlist/times`,
        { params }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || error.response.data
      );
    }
  }
);

// get Filtered Preferable Time by attend_type and age_group
export const fetchPreferableTimeFiltered = createAsyncThunk(
  "view-waitlist/fetchPreferableTimeFiltered",
  async ({ attend_type, age_group }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/dashboard/waitlist/class/view-classes-times`,
        { attend_type, age_group }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || error.response.data
      );
    }
  }
);

// create a new preferable time with age_group
export const createPreferableTime = createAsyncThunk(
  "view-waitlist/createPreferableTime",
  async ({ preferable_time, age_group }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/dashboard/waitlist/time/add`,
        { preferable_time, age_group }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || error.response.data
      );
    }
  }
);

// delete a preferable time
export const deletePreferableTime = createAsyncThunk(
  "view-waitlist/deletePreferableTime",
  async (timeId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/dashboard/waitlist/time/${timeId}/delete`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || error.response.data
      );
    }
  }
);

const ViewSlice = createSlice({
  name: "view-waitlist",
  initialState: {
    loading: false,
    error: null,
    levels: [],
    pymentType: [],
    preferableTime: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLevels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.levels = action.payload;
      })
      .addCase(fetchLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // create a new level
    builder
      .addCase(createLevel.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLevel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // delete a level
    builder
      .addCase(deleteLevel.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLevel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // get all payment type

    builder
      .addCase(fetchPaymentType.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaymentType.fulfilled, (state, action) => {
        state.loading = false;
        state.pymentType = action.payload;
      })
      .addCase(fetchPaymentType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // create a new payment type
    builder
      .addCase(createPaymentType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPaymentType.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPaymentType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // delete a payment type
    builder
      .addCase(deletePaymentType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePaymentType.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePaymentType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // get all preferable time

    builder
      .addCase(fetchPreferableTime.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPreferableTime.fulfilled, (state, action) => {
        state.loading = false;
        state.preferableTime = action.payload;
      })
      .addCase(fetchPreferableTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // get filtered preferable time

    builder
      .addCase(fetchPreferableTimeFiltered.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPreferableTimeFiltered.fulfilled, (state, action) => {
        state.loading = false;
        state.preferableTime = action.payload;
      })
      .addCase(fetchPreferableTimeFiltered.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // create a new preferable time
    builder
      .addCase(createPreferableTime.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPreferableTime.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPreferableTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // delete a preferable time
    builder
      .addCase(deletePreferableTime.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePreferableTime.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePreferableTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = ViewSlice.actions;

export default ViewSlice.reducer;
