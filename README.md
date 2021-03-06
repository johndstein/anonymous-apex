# anonymous-apex

Easily run anonymous Salesforce Apex code with Node.js or on the command line.

`anonymous-apex` allows you to run Apex code from the command line or as a
Node.js module.

We also allow you to template your Apex code with the EJS templating language.
http://www.ejs.co

## Install

```bash
# Install locally for Node.js module usage.
npm i anonymous-apex

# Install globally for command line usage.
npm i -g anonymous-apex
```

## Enjoy

### Node Module

You can require `anonymous-apex` as a node module.

```js
const apex = 'System.debug(\'<%= some.message %>\');';

// data is optional.
const data = {
  some: {
    message: 'frank woo'
  }
};

const options = {
  username: process.env.ANONYMOUS_APEX_USERNAME,
  password: process.env.ANONYMOUS_APEX_PASSWORD
};

require('anonymous-apex').execute(options, apex, data)
  .then((results) => {
    console.error('\ndone', results);
    // Results look as follows. If compiled or success are false, you
    // won't get here, an error will be thrown, and you will end up in
    // the catch block below.
    //
    // { line: -1,
    //   column: -1,
    //   compiled: true,
    //   success: true,
    //   compileProblem: null,
    //   exceptionStackTrace: null,
    //   exceptionMessage: null }
  })
  .catch((error) => {
    console.error(error);
    process.exit(13);
  });
```

### Commmand Line

You can run `anonymous-apex` from the command line.

```bash
anonymous-apex my-code.apex

# or with template data.
anonymous-apex my-code.apex template-data.json
```

```
Usage: anonymous-apex APEX [TEMPLATE_DATA]

  APEX (required) is the path to a file containing your Apex code
    OR just a string of Apex code.

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
```

