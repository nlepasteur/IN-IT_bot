import React, { useState, useEffect, useRef, useContext } from 'react';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

import '../css/chatbotTab.css';

import Message from './Message';
import Wanted from './Wanted';
import { newMessage, newWanted } from '../state/actions';
import Context from '../context';

const cookies = new Cookies();

function Chatbot() {
  if (cookies.get('userID') === undefined)
    cookies.set('userID', uuid(), { path: '/' });
  const { state, dispatch } = useContext(Context);
  const endMessages = useRef(null);
  const input = useRef(null);
  // const [messages, setMessages] = useState([]);
  const [wantedCompleted, setWantedCompleted] = useState(false);
  const [showBot, setShowbot] = useState(true);

  async function df_text_query(text) {
    // let says = {
    //   speaks: 'me',
    //   msg: {
    //     text: {
    //       text,
    //     },
    //   },
    // };

    // setMessages([...messages, says]);
    dispatch(newMessage(text, 'me'));

    const headers = {
      method: 'POST',
      body: JSON.stringify({ text, userID: cookies.get('userID') }),
      headers: {
        'content-type': 'application/json',
      },
    };

    let dfData;
    let wanted = null;
    const res = await fetch('/api/df_text_query', headers);
    const data = await res.json();
    if (data.responses) {
      dfData = data.responses[0].queryResult;
      wanted = data.wanted;
    } else {
      dfData = data[0].queryResult;
    }

    for (let msg of dfData.fulfillmentMessages) {
      // says = {
      //   speaks: 'bot',
      //   msg,
      // };

      // newMessage(msg)

      // setMessages((prevMessages) => [...prevMessages, says]);
      dispatch(newMessage(msg.text.text, 'bot'));
    }
    if (wanted) {
      setWantedCompleted(false);
      for (let w of wanted) {
        // says = {
        //   speaks: 'bot',
        //   wanted: w,
        // };

        // setMessages((prevMessages) => [...prevMessages, says]);
        dispatch(newWanted(w, 'bot'));
      }
      setWantedCompleted(true);
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

    for (let msg of data.fulfillmentMessages) {
      let says = {
        speaks: 'bot',
        msg,
      };

      dispatch(newMessage(msg.text.text, 'bot'));
      // setMessages((prevMessages) => [...prevMessages, says]);
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
    // si dernier state wanted alors event
  });

  useEffect(() => {
    // useEffect pour proposer choix après render du dernier wanted
    if (
      wantedCompleted &&
      state.messages.length > 0 &&
      Object.keys(state.messages[state.messages.length - 1]).includes('wanted')
    ) {
      df_event_query('wanted-follow-up');
    }
  }, [wantedCompleted]);

  function renderMessages(messages) {
    if (messages) {
      return messages.map((message, index) => {
        if (message.msg) {
          return (
            <Message
              key={index}
              speaks={message.speaks}
              text={message.msg.text.text}
            />
          );
        } else if (message.wanted) {
          return (
            <Wanted
              key={index}
              speaks={message.speaks}
              text={message.wanted.NAME}
            />
          );
        } else {
          return null;
        }
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

  // console.log('messages: ', messages);
  console.log('state; ', state);

  if (showBot) {
    return (
      <div className="chatbot-wrapper">
        <div className="chatbot-head">
          <div>IN-IT chatbot</div>
          <button onClick={show}>Close</button>
        </div>
        <div className="chatbot-messages">
          {renderMessages(state.messages)}
          <div ref={endMessages}></div>
        </div>
        <input
          ref={input}
          placeholder="Type a message"
          type="text"
          onKeyPress={handleInputKeyPress}
        />{' '}
        {/* onChange setState un state, puis lorsque input submit déclenche fonction avec ce state en arg   */}
      </div>
    );
  } else {
    return (
      <div className="chatbot-wrapper-closed">
        <div className="chatbot-head">
          <div>IN-IT chatbot</div>
          <button onClick={show}>Show</button>
        </div>

        {/* onChange setState un state, puis lorsque input submit déclenche fonction avec ce state en arg   */}
      </div>
      // {/* <div>
      //   <nav>
      //     <div>
      //       <a href="/">Chatbot</a>
      //       <ul>
      //         <li>
      //           <a href="/" onClick={show}>
      //             Show
      //           </a>
      //         </li>
      //       </ul>
      //     </div>
      //   </nav>
      // </div> */}
    );
  }
}

export default Chatbot;
