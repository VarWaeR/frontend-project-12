import React, { useEffect } from 'react';
import { animateScroll } from 'react-scroll';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MessagesForm from './MessagesForm.jsx';

const Message = ({ username, body }) => (
  <div className="text-break mb-2">
    <b>{username}</b>
    {': '}
    {body}
  </div>
);

const ChatBox = () => {
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channels);
  console.log(channels);
  const allMessages = useSelector((state) => state.messages);
  console.log(allMessages);

  const channel = useSelector((state) => {
    const { currentChannelId } = state.channels;
    return channels?.find((item) => item.id === currentChannelId);
  });

  const messages = useSelector((state) => {
    const { currentChannelId } = state.messages;
    const channelMessage = allMessages?.filter((message) => message.channelId === currentChannelId);
    return channelMessage;
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
};

export default ChatBox;
