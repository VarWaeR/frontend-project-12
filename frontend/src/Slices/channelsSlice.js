/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'channels',
  initialState: {
    currentChannelId: '1',
    defaultChannelId: '1',
    channels: [],
    modal: {
      isOpened: false,
      type: null,
      extra: null,
    },
  },
  reducers: {
    addChannels: (state, { payload }) => {
      state.channels = payload;
    },
    setCurrentChannel(state, { payload }) {
      const { channelId } = payload;
      state.currentChannelId = channelId;
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
