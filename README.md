# anonymous-apex

Easily run anonymous Salesforce Apex code with Node.js or on the command line.

`anonymous-apex` allows you to run Apex code from the command line or as a
Node.js module.

We also allow you to template your Apex code with the EJS templating language.
http://www.ejs.co

## Install

```bash
# Install globally for command line usage.
npm i -g anonymous-apex

# Install locally for Node.js module usage.
npm i anonymous-apex
```

## Enjoy

### Commmand Line

You can run `anonymous-apex` from the command line.

```bash
anonymous-apex < my-code.apex

# or with template data.
anonymous-apex template-data.json < my-code.apex
```

```
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
```

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
  })
  .catch((error) => {
    console.error(error);
    process.exit(13);
  });
```

