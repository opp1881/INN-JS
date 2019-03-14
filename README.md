# INN JS Library

Framework independent library for integrating web applications with Opplysningen INN Single Sign-On solution.

# Registering a new application

Information concerning registering a new application with Opplysningen INN can be found in [Opplysningen INN Single Sign-On documentation](https://inn-prod-ss.opplysningen.no/innss/docs.html)

# Installation

The INN JS Library is available through NPM, and can be installed either using _npm_ or _yarn_

**npm**

```
$ npm install @opplysningen1881/inn-js
```

# Usage

## Initialize the client

```
import innClient from '@opplysningen1881/inn-js';

innClient.init({
    appName: 'Example app', // Name of the application registered through Opplysningen INN
    mode: 'development', // Or production
    requireConsent: true // Used for sharing user information with the given application
});
```
### Override the INN environment URLs
Usually the INN service URLs are decided based on the client `mode`.
The URLs may be overriden through three optional configuration properties. See example below:
```
import innClient from '@opplysningen1881/inn-js';

innClient.init({
    appName: 'Example app', // Name of the application registered through Opplysningen INN
    mode: 'development', // Or production
    requireConsent: true, // Used for sharing user information with the given application
    profileUrl: 'https://inn-override-sso.opplysningen.no/oidsso/js/inn/inn-background.png', // Overrides the default mode configuration
    profileBackgroundUrl: 'https://inn-override-sso.opplysningen.no/oidsso/welcome', // Overrides the default mode configuration
    proxyUrl: 'https://inn-override-spaproxy.opplysningen.no/proxy' // Overrides the default mode configuration
});
```

## Add the INN login button to your application

```
// HTML
<div id="container-for-login-button"></div>

// JavaScript
import innClient from '@opplysningen1881/inn-js';

function handleSuccess(token) {
    // Code for handling login success
}

function handleError() {
    // Code for handling login error
}

innClient.addLoginButtonTo('container-for-login-button', handleSuccess, handleError);
```

## Add the INN checkout button to your application

```
// HTML
<div id="container-for-checkout-button"></div>

// JavaScript
import innClient from '@opplysningen1881/inn-js';

function handleSuccess(token) {
    // Code for handling checkout success
}

function handleError() {
    // Code for handling login error
}

innClient.addCheckoutButtonTo('container-for-checkout-button', handleSuccess, handlerError);
```

## Fetching contact information

```
import innClient from '@opplysningen1881/inn-js';

async function fetchContactInfo() {
    try {
        const contactInfo = await innClient.getContactInfo();
        return contactInfo
    } catch (err) {
        // Handle error
    }
}
```

## Fetching delivery information

```
import innClient from '@opplysningen1881/inn-js';

async function fetchDeliveryInfo() {
    try {
        const deliveryInfo = await innClient.getDeliveryInfo();
        return deliveryInfo;
    } catch (err) {
        // Handle error
    }
};
```

## Fetching token for authorization to backend services

```
import innClient from '@opplysningen1881/inn-js';

innClient.getToken(); // Add as HTTP header (Authorization: Bearer <token>)
```

# Contributing

If you want to contribute, please submit a pull request for review. If you have questions or suggestions, please submit an issue.

## Setup

```
$ npm install
```

## Test

Install Jest, then run with `npm test`.

```
$ npm install -g jest
$ npm test
```

## Build

You'll need Microbundle and Rimraf to make a build.

```
$ npm install -g microbundle rimraf
$ npm run build
```

# License

Apache License 2.0. [See LICENSE.md for details](https://github.com/capralifecycle/INN-JS/blob/master/LICENSE)
