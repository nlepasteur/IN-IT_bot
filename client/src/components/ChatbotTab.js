import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

import Message from './Message';

const cookies = new Cookies();

function Chatbot() {
  if (cookies.get('userID') === undefined)
    cookies.set('userID', uuid(), { path: '/' });
  const endMessages = useRef(null);
  const input = useRef(null);
  const [messages, setMessages] = useState([]);

  console.log(cookies.get('userID'));

  async function df_text_query(text) {
    let says = {
      speaks: 'me',
      msg: {
        text: {
          text,
        },
      },
    };

    setMessages([...messages, says]);

    const headers = {
      method: 'POST',
      body: JSON.stringify({ text, userID: cookies.get('userID') }),
      headers: {
        'content-type': 'application/json',
      },
    };

    const res = await fetch('/api/df_text_query', headers);
    const data = await res.json();

    for (let msg of data.fulfillmentMessages) {
      says = {
        speaks: 'bot',
        msg,
      };

      setMessages((prevMessages) => [...prevMessages, says]);
    }
  }

  async function df_event_query(event) {
    const headers = {
      method: 'POST',
      body: JSON.stringify({ event, userID: cookies.get('userID') }),
      headers: {
        'content-type': 'application/json',
      },
    };

    const res = await fetch('/api/df_event_query', headers);
    const data = await res.json();

    console.log(data);

    for (let msg of data.fulfillmentMessages) {
      let says = {
        speaks: 'bot',
        msg,
      };

      setMessages((prevMessages) => [...prevMessages, says]);
    }
  }

  useEffect(() => {
    df_event_query('welcome');
  }, []);

  useEffect(() => {
    endMessages.current.scrollIntoView({ behaviour: 'smooth' });
    input.current.focus();
  });

  function renderMessages(messages) {
    if (messages) {
      return messages.map((message, index) => {
        return (
          <Message
            key={index}
            speaks={message.speaks}
            text={message.msg.text.text}
          />
        );
      });
    } else {
      return null;
    }
  }

  function handleInputKeyPress(e) {
    if (e.key === 'Enter') {
      df_text_query(e.target.value);
      e.target.value = '';
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        height: 400,
        width: 400,
        bottom: 0,
        right: 0,
      }}
    >
      <div
        id="chatbot"
        style={{ height: '100%', width: '100%', overflow: 'auto' }}
      >
        <h2>Chatbot</h2>
        {renderMessages(messages)}
        <div ref={endMessages} style={{ float: 'left', clear: 'both' }}></div>
        <input ref={input} type="text" onKeyPress={handleInputKeyPress}></input>
      </div>
    </div>
  );
}

export default Chatbot;
