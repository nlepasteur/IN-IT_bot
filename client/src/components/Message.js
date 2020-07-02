import React from 'react';

import '../css/message.css';

function Message(props) {
  return (
    <div
      className="message-wrapper"
      style={
        props.speaks === 'Bot'
          ? { marginLeft: '2em', backgroundColor: '#F5F7FA', color: '#092866' }
          : {
              marginRight: '2em',
              backgroundColor: '#092866',
              color: '#F5F7FA',
            }
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
