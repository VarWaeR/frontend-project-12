import React from 'react';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';
import { Provider as ProviderRollBar, ErrorBoundary } from '@rollbar/react';
import ru from './locales/ru';
import App from './Components/App.jsx';
import store from './Slices/index.js';
import { actions as channelsActions } from './Slices/channelsSlice';
import { actions as messagesActions } from './Slices/messagesSlice';
import { ApiContext, FilterContext } from './Contexts/index.jsx';

const promosifySocket = (socket, type, data) => new Promise((resolve, reject) => {
  socket.timeout(5000).emit(type, data, (err, response) => {
    if (err) {
      reject(err);
    }
    resolve(response);
  });
});

const FilterProvider = ({ children }) => {
  const value = filter.add(filter.getDictionary('ru'));
  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

const init = async (socket) => {
  const i18n = i18next.createInstance();
  await i18n.use(initReactI18next).init({
    resources: { ru },
    fallbackLng: 'ru',
  });

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    environment: 'production',
  };

  socket.on('newMessage', (payload) => {
    const { addMessage } = messagesActions;
    store.dispatch(addMessage(payload));
  });

  socket.on('newChannel', (payload) => {
    store.dispatch(channelsActions.addChannel(payload));
  });

  socket.on('removeChannel', ({ id }) => {
    store.dispatch(channelsActions.removeChannel(id));
  });

  socket.on('renameChannel', (payload) => {
    store.dispatch(channelsActions.renameChannel(payload));
  });

  const addNewMessage = (message) => promosifySocket(socket, 'newMessage', message);
  const createChannel = (channel) => promosifySocket(socket, 'newChannel', channel);
  const removeChannel = (channelId) => promosifySocket(socket, 'removeChannel', channelId);
  const renameChannel = (channel) => promosifySocket(socket, 'renameChannel', channel);

  const api = {
    addNewMessage,
    createChannel,
    removeChannel,
    renameChannel,
  };

  const vdom = (
    <ProviderRollBar config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <ApiContext.Provider value={api}>
              <FilterProvider>
                <App />
              </FilterProvider>
            </ApiContext.Provider>
          </I18nextProvider>
        </Provider>
      </ErrorBoundary>
    </ProviderRollBar>
  );

  return vdom;
};

export default init;
