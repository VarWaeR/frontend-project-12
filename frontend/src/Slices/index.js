import { combineReducers } from '@reduxjs/toolkit';
import ui, { actions } from './channelsSlice.js';
import { channelsApi } from '../Api/channelsApi.js';
import { messagesApi } from '../Api/messagesApi.js';

const defaultChannelId = 1;

export {
  actions,
  defaultChannelId,
};

export default combineReducers({
  ui,
  [channelsApi.reducerPath]: channelsApi.reducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
});