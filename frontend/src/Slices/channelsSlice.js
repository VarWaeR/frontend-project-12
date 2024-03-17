/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { channelsApi } from '../Api/channelsApi';

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
    builder.addMatcher(
      channelsApi.endpoints.addChannel.matchFulfilled,
      (state, action) => {
        state.currentChannelId = action.payload.id;
      },
    );
  },
});

export const { actions } = slice;
export default slice.reducer;
