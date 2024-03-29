import { configureStore } from '@reduxjs/toolkit';
import channelsReducers from './channelsSlice.js';
import messagesReducers from './messagesSlice.js';
import modals from './modalsSlice.js';

export default configureStore({
  reducer: {
    channels: channelsReducers,
    messages: messagesReducers,
    modals,
  },
});
