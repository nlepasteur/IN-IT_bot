import React from 'react';

import '../css/message.css';

function Message(props) {
  return (
    <div className="message-wrapper">
      <div className="message-head">
        <div>{props.speaks}</div>
      </div>

      <div className="message-message">{props.text}</div>
    </div>
  );
}

export default Message;
