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
    addChannel: (state, { payload }) => {
      state.channels.push(payload);
      state.currentChannelId = payload.id;
    },
    removeChannel: (state, { payload }) => {
      const newChannels = state.channels.filter((channel) => channel.id !== payload);
      state.channels = newChannels;
      state.currentChannelId = state.defaultChannelId;
    },
    renameChannel(state, { payload }) {
      const renamingChannel = state.channels.find((channel) => channel.id === payload.id);
      renamingChannel.name = payload.name;
    },
    setCurrentChannel: (state, { payload }) => {
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
});

export const { actions } = slice;
export default slice.reducer;
