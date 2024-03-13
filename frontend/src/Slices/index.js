import { combineReducers } from '@reduxjs/toolkit';
import ui, { actions } from './channelsSlice';
import { channelsApi } from '../Api/channelsApi';
import { messagesApi } from '../Api/messagesApi';

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
