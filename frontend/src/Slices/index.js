import { configureStore } from '@reduxjs/toolkit';
import channelsReducers from './channelsSlice.js';
import messagesReducers from './messagesSlice.js';

export default configureStore({
  reducer: {
    channels: channelsReducers,
    messages: messagesReducers,
  },
});
