import React from 'react';

import '../css/message.css';

function Message(props) {
  return (
    <div
      className="message-wrapper"
      style={
        props.speaks === 'Bot' ? { marginLeft: '2em' } : { marginRight: '2em' }
      }
    >
      <div className="message-head">
        <div>{props.speaks}</div>
        <div>{new Date(props.timeStamp).toLocaleTimeString()}</div>
      </div>

      <div className="message-message">{props.text}</div>
    </div>
  );
}

export default Message;
