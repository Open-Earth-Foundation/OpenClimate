# OpenClimate App

The OpenClimate App is a reference implementation of a Python (ACA-Py) controller and server for issuing verifiable credentials via ACA-Py (https://github.com/hyperledger/aries-cloudagent-python). 

For an introduction to self-sovereign identity (SSI), please see [Phil Windley's article](https://www.windley.com/archives/2018/09/multi-source_and_self-sovereign_identity.shtml) on the topic.

## Table of Contents

- [Features](#background)
- [Design](#install)
- [Installation](#install)
- [Quickstart](#usage)
- [Security](#security)
- [Docs](#api)
- [Credit](#credit)
- [Contributing](#contributing)
- [License](#license)

## Features

_TODO_

## Design

_TODO_

* Philosophy
* Goals/Requirements
* Use cases
* Big-picture diagrams

## Installation

### Separate Module Installation (non-containerized)
If you're running as separate modules not in a containerized context, create a .env File with the following variables specific to your setup:
```
CONTROLLERPORT=3100
AGENTADDRESS='http://AGENT_IP_ADDRESS:8150' (the default agent address is localhost)
WEB_ROOT=https://localhost_or_ip_address_or_domain:port_number_if_necessary/
JWT_SECRET=yoursecrethere (32 alpha-numeric digits, e.g. GGgNz2CVwxBJjhVzHmuKPV3bEJMdViKP)
SESSION_SECRET=yoursecrethere (32 alpha-numeric digits, e.g. y5YSfodHhp6QkbG3IxaqlzcFQXUlZquh)
```

Add the following line to your ACA-Py Agent startup.sh file:
```
--webhook-url "$WEBHOOK_ADDRESS" \
```

Add the controller ip-address (default localhost) and port (default port 3100) in your agent YML file for each agent the following line:
```
WEBHOOK_ADDRESS: http://CONTROLLER_IP_ADDRESS:CONTROLLER_PORT/api/controller-webhook
```

Run the following command to install the needed dependencies
```
npm install
```

Once the controller, agent, and database are all running, you will need to run a one-time startup script, which will also need to be ran everytime the agent and database are reset. This script will set up a public DID for you, provide the TAA for acceptance, and create a credential definition.
```
/bin/bash ./scripts/startupScript.sh
```

_TODO_

* Installing this app and dependencies (including cloud agent, network, etc.)
* OS requirements, etc.
* Quick test to make sure everything is working

## Quickstart

### Separate Module Quickstart (non-containerized) 
Upon installation, run
```
npm run dev

/bin/bash ./scripts/startupScript.sh
```

## Deployment

In the project directory, you can run the following command to build the app for production to the `build` folder:

_TODO_

## Customization

_TODO: How to skin, guidelines around forking, etc._

## Security

_TODO_

## Docs

_TODO_

## Logging

Logs are emitted using the [winston](https://www.npmjs.com/package/winston) logging package. Each log line is a [JSON](https://json.org/) object, with structured properties. The `level` property indicates the severity of the logged event: `debug`, `info`, `warning` and `error` are the main levels.

## Credit

_TODO_

## Contributing

If you are a new contributor to the project, please read our [contribution guide](./CONTRIBUTING.md) at least once; it will save you a few review cycles!

## License

Copyright © The OpenEarth Project 2021. Confidential. All rights reserved. 

Please see the LICENSE file for the complete license and copyright statement.

## Developer Certificate of Origin (DCO)

Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.
1 Letterman Drive
Suite D4700
San Francisco, CA, 94129

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.

Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
   have the right to submit it under the open source license
   indicated in the file; or

(b) The contribution is based upon previous work that, to the best
   of my knowledge, is covered under an appropriate open source
   license and I have the right under that license to submit that
   work with modifications, whether created in whole or in part
   by me, under the same open source license (unless I am
   permitted to submit under a different license), as indicated
   in the file; or

(c) The contribution was provided directly to me by some other
   person who certified (a), (b) or (c) and I have not modified
   it.

(d) I understand and agree that this project and the contribution
   are public and that a record of the contribution (including all
   personal information I submit with it, including my sign-off) is
   maintained indefinitely and may be redistributed consistent with
   this project or the open source license(s) involved.
