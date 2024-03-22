import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import ChannelsBox from './ChannelsBox.jsx';
import ChatBox from './ChatBox.jsx';
import Modal from './Modals.jsx';
import useAuth from '../Hooks/index.jsx';
import { actions, selectors } from '../Slices/channelsSlice.js';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { getAuthHeader } = useAuth();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('api/v1/channels', {
          headers: getAuthHeader(),
        });
        const { channels, currentChannelId } = data;
        dispatch(actions.addChannels(channels));
        dispatch(actions.setCurrentChannel(currentChannelId));
      } catch (error) {
        if (!error.isAxiosError) {
          toast.error(t('errors.unknown'));
        } else {
          toast.error(t('errors.network'));
        }

        throw error;
      }
      setLoading(false);
    };

    fetchData();
  }, [dispatch, getAuthHeader, t]);

  const chans = useSelector(selectors.selectAll);
  console.log(chans);

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
