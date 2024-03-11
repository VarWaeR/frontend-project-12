import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import ru from './locales/ru';
import App from './Components/App.jsx';
import reducer, { actions } from './Slices/index.js';
import { channelsApi } from './Api/channelsApi.js';
import { messagesApi } from './Api/messagesApi.js';

const init = async (socket) => {

  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
      .concat([channelsApi.middleware, messagesApi.middleware]),
  });

  const i18n = i18next.createInstance();
  await i18n.use(initReactI18next).init({
    resources: { ru },
    fallbackLng: 'ru',
  });

  socket.on('newMessage', (payload) => {
    store.dispatch(messagesApi.util.updateQueryData('getMessages', undefined, (draftMessages) => {
      draftMessages.push(payload);
    }));
  });

  socket.on('newChannel', (payload) => {
    store.dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draftChannels) => {
      draftChannels.push(payload);
    }));
  });

  socket.on('removeChannel', (payload) => {
    store.dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draftChannels) => {
      const newChannels = draftChannels.filter((channel) => channel.id !== payload.id);
      const state = store.getState();
      if (state.ui.currentChannelId === payload.id) {
        store.dispatch(actions.setCurrentChannel(state.ui.defaultChannelId));
      }
      return newChannels;
    }));
  });

  socket.on('renameChannel', (payload) => {
    store.dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draftChannels) => {
      const channel = draftChannels.find((item) => item.id === payload.id);
      channel.name = payload.name;
    }));
  });

  const vdom = (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>
  );

  return vdom;
};

export default init;