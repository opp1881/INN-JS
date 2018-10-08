# INN JS Library

Library for integrating web applications with Opplysningen INN Single Sign-On solution.

# Demo

A demo with example implementation can be seen at JSFiddle

TODO: Update JSFiddle

# Installation

The INN JS Library is available through NPM. This can be installed using _npm_ or _yarn_

**yarn**

```
$ yarn install @opplysningen1881/inn-js
```

**npm**

```
$ npm i @opplysningen1881/inn-js
```

# Usage

## Initialize the client

```
import innClient from '@opplysningen1881/inn-js';

innClient.init({
    appName: 'Example app', // Name of the application registered through Opplysningen INN
    spaProxyUrl: 'https://url.to.spa.proxy', // URL to Opplysningen INN SPA Proxy
    ssoLoginUrl: 'https://url.to.sso.login' // URL to Opplysningen INN SSO Login
});
```

## Authenticating with Opplysningen INN

```
// Assuming the innClient have already been initialized

const authenticate = async () => {
    try {
        const userToken = await innClient.authenticate();
    catch (err) {
        // Error message from innClient
    }
};
```

## Fetching delivery info

```
// Assuming the innClient have already been initialized and
// that the client have authenticated with Opplysningen INN

const fetchDeliveryInfo = async () => {
    try {
        const deliveryInfo = await innClient.getDeliveryInfo();
    } catch (err) {
        // Error message from innClient
    }
};
```

# Contributing

TODO: Information about how developers can either contact us or suggest improvements to the client.

# License

Apache License 2.0. [See LICENSE.md for details](https://github.com/capralifecycle/INN-JS/blob/master/LICENSE)
