const fetch = require('node-fetch');
const dialogFlow = require('dialogflow');

const config = require('../config/keys');
const structjson = require('./structjson');

const PROJECTS_API = config.INITProjectsAPI;
const ACTIVES_PROJECTS_API = config.INITActivesProjectsAPI;

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
    responses = await self.handleAction(responses);
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

    responses = await self.handleAction(responses);
    return responses;
  },

  async handleAction(responses) {
    const self = module.exports;
    let wanted = null;
    const { queryText } = responses[0].queryResult;
    const checkParam = Object.keys(responses[0].queryResult.parameters.fields);
    //
    // vérifie si un seul paramètre et qu'il est client, si tel est le cas renverra dossiers liés actifs ou pas
    if (checkParam.length === 1 && checkParam[0] === 'client') {
      const client =
        responses[0].queryResult.parameters.fields.client.stringValue;
      wanted = await self.fetchAPI(queryText, PROJECTS_API, client);
    } else if (
      checkParam.includes('actifs') &&
      checkParam.includes('projets')
    ) {
      const client =
        responses[0].queryResult.parameters.fields.client.stringValue;
      wanted = await self.fetchAPI(queryText, ACTIVES_PROJECTS_API, client);
    }
    // retourner wanted dans réponse que si présent sinon créera une erreur
    return wanted ? { responses, wanted } : responses;
  },

  // ici avait ajouté valeur par défaut en prévision d'utiliser fonction pour autres cas
  async fetchAPI(textQuery, route, clientName) {
    // commun
    const response = await fetch(route);
    const data = await response.json();
    //
    // ici ajouté condition ou switch
    // split permet de prendre compte de tous les mots rentrés par l'user
    // const client =
    const client = clientName.toLowerCase().split(' ');
    let result;

    const wanted = data.filter((obj) => {
      const decomposed = [];
      for (let i = 0; i < client.length; i++) {
        decomposed.push(obj.CUSTOMER.toLowerCase().includes(client[i]));
      }
      if (client.length > 1) {
        result = decomposed.reduce((acc, cur) => acc + cur);
      } else {
        result = decomposed[0] === true ? 1 : 0;
      }
      return result === client.length;
    });
    return wanted;
  },
};
