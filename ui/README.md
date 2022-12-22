# OpenClimate UI

The OpenClimate React Application is the Front-End portion of the Independent Climate Accounting Network. It is in support of Paris Agreement goals and presents important climate data for actors in the world (countries, region/provinces, cities, and companies). The app also seeks to issue identity (SSI) credentials via an Aries cloud agent (such as [ACA-Py](https://github.com/hyperledger/aries-cloudagent-python)) for user authentication, and climate data reporting for companies.

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

The OpenClimate React App has three major features:

- Explore Page: This is the home page for the app and can be accessed by all users, with or without an account. It allows searching or navigating through dropdowns to find different actors and their Total Emissions by source and year, Pledges, and Contextual Data. The Explore Page is the most recently designed and serves as the crux of the app. Most feedback and contributions should center around this page as of the current implementation.
- Account page: The Account Page is limited to users with an account. It allows users to see their companies' climate data based on Climate Actions, Site, and Pledges and the ability to report additional actions, sites, and pledges. Verifying climate actions requires the addition of a business wallet with credentials to a third party that approves the emissions and site information.
- Admin page: The Admin page is for admins of Open Climate only. It allows monitoring of Contacts, Credentials, Users, Organizations, and other Settings. This is where users are invited to Open Climate and can then create an account.

## Design

_TODO_

OpenClimate App utilizes Material UI for most of its components.

- Philosophy
- Goals/Requirements
- Use cases
- Big-picture diagrams

## Installation

_TODO_

- Installing this app and dependencies (including cloud agent, network, etc.)
- OS requirements, etc.
- Quick test to make sure everything is working

## Quickstart

_TODO_

## Deployment

In the project directory, you can run the following command to build the app for production to the `build` folder:

```bash
$ `npm run build
```

This command correctly bundles React in production mode and optimizes the build for the best performance.

See also the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Customization

_TODO: How to skin, guidelines around forking, etc._

## Security

_TODO_

## Docs

_TODO_

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
