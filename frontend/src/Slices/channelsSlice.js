/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const defaultChannelId = '1';

const slice = createSlice({
  name: 'channels',
  initialState: {
    currentChannelId: '1',
    channels: [],
  },
  reducers: {
    addChannels: (state, { payload }) => {
      state.channels = payload;
    },
    addChannel: (state, { payload }) => {
      state.channels.push(payload);
    },
    removeChannel: (state, { payload }) => {
      const newChannels = state.channels.filter((channel) => channel.id !== payload);
      state.channels = newChannels;
      if (state.currentChannelId === payload) {
        state.currentChannelId = defaultChannelId;
      }
    },
    renameChannel: (state, { payload }) => {
      const renamingChannel = state.channels.find((channel) => channel.id === payload.id);
      renamingChannel.name = payload.name;
    },
    setCurrentChannel: (state, { payload }) => {
      const { id } = payload;
      state.currentChannelId = id;
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
