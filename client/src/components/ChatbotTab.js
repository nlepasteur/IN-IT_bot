import React, { useState, useEffect, useRef, useContext } from 'react';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

import '../css/chatbotTab.css';
import '../css/wanteds.css';

import Message from './Message';
import Wanted from './Wanted';
import { newMessage, newWanted, newPayload } from '../state/actions';
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
  const [inputValue, setInputValue] = useState('');
  const [buttonVisible, setButtonVisible] = useState(false);
  const [followUpButtonsDisabled, setFollowUpButtonsDisabled] = useState(false);

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
    dispatch(newMessage(text, 'Me'));

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
      dispatch(newMessage(msg.text.text, 'Bot'));
    }
    if (wanted) {
      setWantedCompleted(false);
      for (let w of wanted) {
        // says = {
        //   speaks: 'bot',
        //   wanted: w,
        // };

        // setMessages((prevMessages) => [...prevMessages, says]);
        dispatch(newWanted(w, 'Bot'));
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

    console.log('data: ', data);

    for (let msg of data.fulfillmentMessages) {
      // let says = {
      //   speaks: 'Bot',
      //   msg,
      // };
      if (!Object.keys(msg).includes('payload')) {
        console.log('MESSAGE SUITE A EVENT: ', msg);
        dispatch(newMessage(msg.text.text, 'Bot'));
      } else {
        dispatch(newPayload(msg, 'Bot'));
      }
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

  function renderWanteds(wanteds) {
    return (
      <div key="uuid()" className="wanteds-wrapper">
        {wanteds.map((w, index) => {
          return (
            <Wanted
              key={uuid()}
              speaks={w.speaks}
              w={w}
              addProject={addProject}
              removeProject={removeProject}
              buttonVisible={buttonVisible}
            />
          );
        })}
      </div>
    );
  }

  function renderMessages(messages) {
    let wanteds = [];
    console.log('MESSAGES: ', messages);
    if (messages) {
      return messages.map((message, index) => {
        if (message.payload) {
          return (
            <div key={uuid()}>
              {message.payload.payload.fields.options.listValue.values.map(
                (payload) => {
                  return (
                    <button
                      key={uuid()}
                      onClick={followUp}
                      disabled={followUpButtonsDisabled}
                    >
                      {payload.stringValue}
                    </button>
                  );
                }
              )}
            </div>
          );
        } else if (message.msg) {
          return (
            <Message
              key={uuid()}
              timeStamp={message.timeStamp}
              speaks={message.speaks}
              text={message.msg.text.text}
            />
          );
        } else if (message.wanted) {
          wanteds.push(message);
          if (index === messages.length - 1) {
            // ici en 2 temps  permet de clean wanteds pour les wanted suivants entrecoupés de messages sans wanted (évite de réafficher même contenu)
            const toRender = wanteds;
            wanteds = [];
            return renderWanteds(toRender);
          } else if (!messages[index + 1].wanted) {
            // ici  en 2 temps permet de clean wanteds pour les wanted suivants entrecoupés de messages sans wanted (évite de réafficher même contenu)
            const toRender = wanteds;
            wanteds = [];
            return renderWanteds(toRender);
          }
        } else {
          return null;
        }
      });
    } else {
      return null;
    }
  }

  function followUp(e) {
    df_text_query(e.target.textContent);
    if (e.target.textContent === 'oui') {
      setButtonVisible(true);
      setFollowUpButtonsDisabled(true);
    }
  }

  function handleInputKeyPress(e) {
    if (e.key === 'Enter') {
      df_text_query(e.target.value);
      setInputValue('');
    }
    if (buttonVisible === true) {
      setButtonVisible(false);
    }
  }

  function show(e) {
    e.preventDefault();
    e.stopPropagation();
    setShowbot(!showBot);
  }

  function addProject(e, project) {
    const input = document.querySelector('input');
    input.value += `${project} / `;
  }

  function removeProject(e, project) {
    const input = document.querySelector('input');
    input.value = input.value.replace(`${project} /`, '');
  }

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
          value={inputValue}
          ref={input}
          placeholder="Type a message"
          type="text"
          onChange={(e) => setInputValue(e.target.value)}
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
    );
  }
}

export default Chatbot;
