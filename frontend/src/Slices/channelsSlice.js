/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState();

const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
    updateChannel: channelsAdapter.updateOne,
    setCurrentChannel: (state, { payload }) => ({ ...state, currentChannelId: payload }),
    removeChannel: (state, { payload }) => channelsAdapter.removeOne(state, payload.id),
    changeChannel: (state, { payload }) => { state.currentChannelId = payload; },
  },
});

export const { actions } = slice;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default slice.reducer;
