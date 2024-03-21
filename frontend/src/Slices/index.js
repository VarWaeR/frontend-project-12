import { configureStore } from '@reduxjs/toolkit';
import channelsReducers from './channelsSlice.js';

const defaultChannelId = 1;

export {
  defaultChannelId,
};

export default configureStore({
  reducer: {
    ui: channelsReducers,
  },
});
