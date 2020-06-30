export const initialState = {
  messages: [],
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'NEW_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.item],
      };
    case 'NEW_WANTED':
      return {
        ...state,
        messages: [...state.messages, action.item],
      };

    case 'NEW_PAYLOAD':
      return {
        ...state,
        messages: [...state.messages, action.item],
      };

    default:
      return state;
  }
};
