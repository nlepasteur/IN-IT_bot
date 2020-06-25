import React, { useReducer } from 'react';
import ChatbotTab from './ChatbotTab';

import Context from '../context';
import { initialState, reducer } from '../state/reducer';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      <div>
        <ChatbotTab />
      </div>
    </Context.Provider>
  );
}

export default App;
