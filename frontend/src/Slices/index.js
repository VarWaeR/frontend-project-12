import { configureStore } from '@reduxjs/toolkit';
import channelsReducers from './channelsSlice.js';
import messagesReducers from './messagesSlice.js';

const defaultChannelId = 1;

export {
  defaultChannelId,
};

export default configureStore({
  reducer: {
    channels: channelsReducers,
    messages: messagesReducers,
  },
});
