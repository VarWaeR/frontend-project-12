/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (header) => {
    try {
      const response = await axios.get('/api/v1/channels', { headers: header });
      return response.data;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  },
);

const channelsAdapter = createEntityAdapter();

const slice = createSlice({
  name: 'ui',
  initialState: {
    currentChannelId: '1',
    defaultChannelId: '1',
    modal: {
      isOpened: false,
      type: null,
      extra: null,
    },
  },
  reducers: {
    setChannels: (state, { payload }) => channelsAdapter.addMany(state, payload),
    addChannel: (state, { payload }) => channelsAdapter.addOne(state, payload),
    deleteChannel: (state, { payload }) => channelsAdapter.removeOne(state, payload),
    updateChannel: channelsAdapter.upsertOne,
    setCurrentChannel(state, { payload }) {
      const { channelId } = payload;
      state.currentChannelId = channelId;
    },
    openModal: (state, { payload }) => {
      const { type, extra } = payload;
      state.modal.isOpened = true;
      state.modal.type = type;
      state.modal.extra = extra ?? null;
    },
    closeModal: (state) => {
      state.modal.isOpened = false;
      state.modal.type = null;
      state.modal.extra = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.fulfilled, (state, action) => {
        channelsAdapter.setAll(state, action.payload);
      });
  },
});

export const { actions } = slice;
export const selectors = channelsAdapter.getSelectors((state) => {
  console.log(state);
  return state.ui;
});
export default slice.reducer;
