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
  const [showBot, setShowbot] = useState(true);

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
    if (showBot) {
      endMessages.current.scrollIntoView({ behaviour: 'smooth' });
      input.current.focus();
    }
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

  function show(e) {
    e.preventDefault();
    e.stopPropagation();
    setShowbot(!showBot);
  }

  if (showBot) {
    return (
      <div
        style={{
          height: 500,
          width: 400,
          position: 'absolute',
          bottom: 0,
          right: 0,
          border: 'solid 1px lightgrey',
        }}
      >
        <nav>
          <div className="nav-wrapper">
            <a href="/" className="brand-logo">
              Chatbot
            </a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <a href="/" onClick={show}>
                  Close
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div
          id="chatbot"
          style={{ height: 388, width: '100%', overflow: 'auto' }}
        >
          {renderMessages(messages)}
          <div ref={endMessages} style={{ float: 'left', clear: 'both' }}></div>
        </div>
        <div className="col s12">
          <input
            ref={input}
            placeholder="Type a message"
            type="text"
            onKeyPress={handleInputKeyPress}
            style={{ margin: 0, padding: '0 1% 0 1%', width: '98%' }}
          />{' '}
          {/* onChange setState un state, puis lorsque input submit déclenche fonction avec ce state en arg   */}
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          minHeight: 40,
          maxHeight: 500,
          width: 400,
          position: 'absolute',
          bottom: 0,
          right: 0,
          border: 'solid 1px lightgrey',
        }}
      >
        <nav>
          <div className="nav-wrapper">
            <a href="/" className="brand-logo">
              Chatbot
            </a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <a href="/" onClick={show}>
                  Show
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default Chatbot;
