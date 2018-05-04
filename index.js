#!/usr/bin/env node

'use strict';

// You can set the NODE_DEBUG environment variable if you want us to be
// chatty (INDLUDING USERNAME and PASSWORD info)!!!
const isDebug = process.env.NODE_DEBUG &&
  process.env.NODE_DEBUG.includes('ANONYMOUS_APEX');

const jsforce = require('jsforce');

const {
  promisify
} = require('util');

class ApexAnonymous {

  constructor(options) {
    if (!options) throw new Error('options.username and password required');
    if (isDebug) console.error('\noptions:', options);
    this.options = options;
    if (!options.username) throw new Error('options.username required');
    if (!options.password) throw new Error('options.password required');
  }

  async _login() {
    if (isDebug) console.error('\n_login');
    if (!this.userInfo) {
      if (isDebug) console.error('\n_login: no userInfo');
      this.connection = new jsforce.Connection();
      this.userInfo = await promisify(this.connection.login)
        .bind(this.connection)(this.options.username, this.options.password);
    }
    return this.userInfo;
  }

  // Executes the provided apex code.
  //
  // data is optional. if provided we use the EJS template language to
  // template out the apex code. http://www.ejs.co
  async execute(apex, data) {
    if (isDebug) console.error('\nexecute apex:', apex, 'data:', data);
    await this._login();
    if (data) {
      const ejs = require('ejs');
      apex = ejs.compile(apex)(data);
      if (isDebug) console.error('\ntemplated apex:', apex);
    }
    const results = await promisify(this.connection.tooling.executeAnonymous)
      .bind(this.connection.tooling)(apex);
    if (isDebug) console.error('\nresults:', results);
    return results;
  }
}

ApexAnonymous.execute = async function(options, apex, data) {
  return new ApexAnonymous(options).execute(apex, data);
};

exports = module.exports = ApexAnonymous;

if (require.main === module) {

  const apex = 'System.debug(\'<%= some.message %>\');';

  const data = {
    some: {
      message: 'frank woo'
    }
  };

  const options = {
    username: process.env.ANONYMOUS_APEX_USERNAME,
    password: process.env.ANONYMOUS_APEX_PASSWORD
  };

  // const anonymousApex = new ApexAnonymous(options);

  ApexAnonymous.execute(options, apex, data)
    .then((results) => {
      console.error('\ndone', results);
    })
    .catch((error) => {
      console.error(error);
      process.exit(13);
    });
}