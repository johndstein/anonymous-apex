#!/usr/bin/env node

'use strict';

const usage = `
Usage: anonymous-apex APEX [TEMPLATE_DATA]

  APEX (required) is the path to a file containing your Apex code.

  TEMPLATE_DATA (optional) is the path to a file containing
    JSON data to apply to your APEX code template.

  We will use the following environment variables.

  ANONYMOUS_APEX_USERNAME
  ANONYMOUS_APEX_PASSWORD

  Password needs to be your Salesforce password with the security
  token appended.

  You can set the NODE_DEBUG environment variable if you want us
  to be chatty (INDLUDING USERNAME and PASSWORD info)!!!

  NODE_DEBUG=ANONYMOUS_APEX anonymous-apex APEX [TEMPLATE_DATA]
`;


function helpAndExit(message) {
  console.error('\n' + message + '\n' + usage);
  process.exit(12);
}

if (!process.argv[2]) {
  helpAndExit('APEX required!');
}

const fs = require('fs');
const apex = fs.readFileSync(process.argv[2]).toString();
let data = null;
if (process.argv[3]) {
  data = JSON.parse(fs.readFileSync(process.argv[3]).toString());
}

const options = {
  username: process.env.ANONYMOUS_APEX_USERNAME,
  password: process.env.ANONYMOUS_APEX_PASSWORD
};

require('./')
  .execute(options, apex, data)
  .then((results) => {
    if (!results.compiled || !results.success) {
      console.error('APEX', apex);
      console.error('DATA', data);
      console.error('ERROR', results);
      process.exit(13);
    }
  })
  .catch((error) => {
    console.error(error, error.stack);
    process.exit(13);
  });