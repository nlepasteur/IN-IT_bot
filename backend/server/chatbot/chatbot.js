const dialogFlow = require('dialogflow');
const config = require('../config/keys');
const structjson = require('./structjson');

const projectID = config.googleProjectID;

const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey,
};

// Instantiate a DialogFlow client.
const sessionClient = new dialogFlow.SessionsClient({ projectID, credentials });

module.exports = {
  async textQuery(req, userID, parameters = {}) {
    // Define session path.
    const sessionPath = sessionClient.sessionPath(
      config.googleProjectID,
      config.dialogFlowSessionId + userID
    );
    const self = module.exports;
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: req,
          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
      queryParams: {
        payload: {
          data: parameters,
        },
      },
    };

    let responses = await sessionClient.detectIntent(request);
    responses = self.handleAction(responses);
    return responses;
  },

  async eventQuery(event, userID, parameters = {}) {
    // Define session path.
    const sessionPath = sessionClient.sessionPath(
      config.googleProjectID,
      config.dialogFlowSessionId + userID
    );
    const self = module.exports;
    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          name: event,
          parameters: structjson.jsonToStructProto(parameters),
          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
    };

    let responses = await sessionClient.detectIntent(request);
    responses = self.handleAction(responses);
    return responses;
  },

  handleAction(response) {
    return response;
  },
};
