const chatbot = require('../chatbot/chatbot');

module.exports = function (app) {
  app.post('/api/df_text_query', async (req, res) => {
    const responses = await chatbot.textQuery(
      req.body.text,
      req.userId,
      req.body.parameters
    );
    res.send(responses);
  });

  app.post('/api/df_event_query', async (req, res) => {
    const responses = await chatbot.eventQuery(
      req.body.event,
      req.userID,
      req.body.parameters
    );
    res.send(responses[0].queryResult);
  });
};
