import { v4 as uuid } from 'uuid';

export const newMessage = (text, speaker) => {
  return {
    type: 'NEW_MESSAGE',
    item: {
      id: uuid(),
      speaks: speaker,
      msg: {
        text: {
          text,
        },
      },
      timeStamp: Date.now(),
    },
  };
};

export const newWanted = (wanted, speaker) => {
  return {
    type: 'NEW_WANTED',
    item: {
      id: uuid(),
      speaks: speaker,
      wanted,
    },
  };
};
