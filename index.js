"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { actionssdk } = require('actions-on-google');
const { WebhookClient } = require('dialogflow-fulfillment');
const restService = express();
const request = require('request-promise-native');

restService.use(
    bodyParser.urlencoded({
        extended: true
    })
);

restService.use(bodyParser.json());

restService.post("/echo", function (req, res) {
    //console.log('nouvelle requete');
    //console.log(req.body);
    const app = actionssdk();
    const agent = new WebhookClient({ request: req, response: res });
    const email_intent = 'intent.emailid';
    const user_name = 'username';
    let intentMap = new Map();
    intentMap.set(email_intent, handleemailidrequest);
    intentMap.set(user_name, handleemailidrequest);
    agent.handleRequest(intentMap);

});

function handleemailidrequest(agent) {

    console.log("email :" + agent.parameters.email);
    console.log("username :" + agent.parameters.username);
    var email_id = agent.parameters.email;

    var options = {
        uri: "https://sb.ftdmobileapi.com/user/exists?email=" + email_id + "&uid=9MFPAH0OROD6VDEWEWQWTZYNB5NKML467RXO9WDMS9MIL122RM&type=android&appversion=11.0.0&app=sharisberries_android&design=1&scale=3.0"
        ,
        json: true
    };

    return request.get(options)
        .then(result => {
            console.log(result.reference);
            if (result.reference == "ACCOUNT_EXISTS") {
                agent.add("Hi you are already exist on FTD world :) Welcome :) How may I help you??");
            } else {
                agent.add("You are new to FTD. Can I create an account for you");
            }

            return Promise.resolve(agent);
        });
}

restService.listen(process.env.PORT || 5001, function () {
    console.log("Server up and listening");
});