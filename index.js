'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Text, Card, Image, Suggestion, Payload} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add('Welcome to the constructive dismissal bot!');
    agent.add('I am here to quiz you if you have grounds for a constuctive dismissal.');
    agent.add('Did your manager fail to pay your wages?');
  }

  function addScore(agent) {
    // Get parameter from Dialogflow
    const answer = agent.parameters.answer;
    console.log(`User requested to convert ${answer}`);

    let totalScore;
    if (answer === 'yes') {
      totalScore += 1;
      console.log(totalScore);
    }

    // Sent the context to store the parameter information
    agent.setContext({
      name: 'answer',
      lifespan: 1,
      parameters:{answer: answer}
    });

    // Compile and send response
    agent.add(`Your last answer was ${answer} and the score: ${totalScore}`);

  }

  function fallback(agent) {
    agent.add('Woah! Its getting a little hot in here.');
    agent.add(`I didn't get that, can you try again?`);
  }

  let intentMap = new Map(); // Map functions to Dialogflow intent names
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('add score', addScore);
  intentMap.set('Default Fallback Intent', fallback);
  agent.handleRequest(intentMap);

});
