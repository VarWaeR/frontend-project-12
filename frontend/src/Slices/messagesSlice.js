import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();

const initialState = {
  messages: [],
};

const slice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages: messagesAdapter.addMany,
    addMessage: (state, { payload }) => {
      state.messages.push(payload);
    },
  },
});

export const { actions } = slice;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default slice.reducer;
