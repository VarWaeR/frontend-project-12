import React, { useEffect } from 'react';
import { animateScroll } from 'react-scroll';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useGetChannels } from '../Api/channelsApi.js';
import { useGetMessages } from '../Api/messagesApi.js';
import MessagesForm from './MessagesForm.jsx';

function Message({ username, body }) {
  return (
    <div className="text-break mb-2">
      <b>{username}</b>
      {': '}
      {body}
    </div>
  );
}

function ChatBox() {
  const { t } = useTranslation();
  const { data: channels } = useGetChannels(undefined);
  const { data: allMessages } = useGetMessages(undefined);

  const channel = useSelector((state) => {
    const { currentChannelId } = state.ui;
    return channels?.find((channel) => channel.id === currentChannelId);
  });

  const messages = useSelector((state) => {
    const { currentChannelId } = state.ui;
    const channelMessages = allMessages?.filter((message) => message.channelId === currentChannelId);
    return channelMessages;
  });

  useEffect(() => {
    animateScroll.scrollToBottom({ containerId: 'messages-box', delay: 0, duration: 0 });
  }, [messages?.length]);

  return (
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>
            {`# ${channel?.name}`}
          </b>
        </p>
        <span className="text-muted">
          {`${t('messages.message', { count: messages.length })}`}
        </span>
      </div>
      <div id="messages-box" className="chat-messages overflow-auto px-5 ">
        {messages.map(({ id, username, body }) => (
          <Message
            key={id}
            username={username}
            body={body}
          />
        ))}
      </div>
      <div className="mt-auto px-5 py-3">
        <MessagesForm channel={channel} />
      </div>
    </div>
  );
}

export default ChatBox;
