import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import ChannelsBox from './ChannelsBox.jsx';
import ChatBox from './ChatBox.jsx';
import Modal from './Modals.jsx';
import useAuth from '../Hooks/index.jsx';
import { actions as channelsActions } from '../Slices/channelsSlice.js';
import { actions as messagesActions } from '../Slices/messagesSlice.js';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { getAuthHeader } = useAuth();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataChannels = await axios.get('api/v1/channels', {
          headers: getAuthHeader(),
        });
        const dataMessages = await axios.get('api/v1/messages', {
          headers: getAuthHeader(),
        });
        dispatch(channelsActions.addChannels(dataChannels.data));
        dispatch(messagesActions.addMessages(dataMessages.data));
      } catch (error) {
        if (!error.isAxiosError) {
          console.log(error);
          toast.error(t('errors.unknown'));
        } else {
          toast.error(t('errors.network'));
        }

        throw error;
      }
    };
    setLoading(false);
    fetchData();
  }, [dispatch, getAuthHeader, t]);

  return loading ? (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">{t('loading')}</span>
      </Spinner>
    </div>
  )
    : (
      <>
        <Modal />
        <div className="container h-100 my-4 overflow-hidden rounded shadow">
          <div className="row h-100 bg-white flex-md-row">
            <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
              <ChannelsBox />
            </div>
            <div className="col p-0 h-100">
              <ChatBox />
            </div>
          </div>
        </div>
      </>
    );
};

export default ChatPage;
