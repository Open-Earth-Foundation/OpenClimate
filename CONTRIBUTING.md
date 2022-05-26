## Contributor's Guide

Thanks for your interest in the project! We welcome pull requests from
developers of all skill levels. To get started, simply fork the master branch
on GitHub to your personal account and then clone the fork into your
development environment.

If you would like to contribute but don't already have something in mind,
we invite you to take a look at our issues list. If you see one you'd like
to work on, please leave a quick comment so that we don't end up with
duplicated effort. Thanks in advance!

Please note that all contributors and maintainers of this project are subject to our [Code of Conduct][coc].

### Quick Links

This project is built with React.

- [React documentation](https://reactjs.org/)
- [Code Splitting](https://facebook.github.io/create-react-app/docs/code-splitting)
- [Analyzing the Bundle Size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
- [Advanced Configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)
- [Deployment](https://facebook.github.io/create-react-app/docs/deployment)
- [Minification Troubleshooting](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### Pull Requests

Before submitting a pull request, please ensure you have added or updated tests as appropriate, and that all existing tests still pass with your changes. Please also ensure that your coding style is consistent with existing code in the project. A checklist is included in the PR template as a friendly reminder.

To check code style and ensure all tests pass on your box simply run:

```bash
$ scripts/preflight
```

### Commit Messages

Commit messages should be formatted according to the [Conventional Commits](https://www.conventionalcommits.org/) style.

Also, we require all contributors to agree to the [DCO](https://developercertificate.org/). Every commit must contain a DCO `Signed-off-by` line (we use the [DCO GitHub app](https://github.com/apps/dco) to enforce this). To automatically add this line, simply include the `-s` flag when executing `git commit`.

Unfortunately, tools such as [coderanger/dco](https://github.com/coderanger/dco) will not work once you have installed the [Husky](https://github.com/typicode/husky) `commit-msg` hook that we use for linting commit messages.

### Test coverage

Pull requests must maintain 100% test coverage of all code branches. This helps ensure the quality of the project. To check coverage before submitting a pull request:

```bash
$ scripts/preflight
```

_TODO: Actually implement coverage reporting, and talk about how the developer can examine the report._

### Coding Style

One of the easiest ways to ensure your contributions adhere to the project's coding style is to use [Prettier](https://prettier.io/) (included as a dev dependency).

To have Prettier monitor your files and make changes as you do, open a terminal window to the project folder and type `npm run style-watch`.<br />
To check your files, you can type `npm run style-check"`<br />
To have Prettier format all your files, type `npm run style-format`<br />

More Prettier CLI options can be found here: [https://prettier.io/docs/en/cli.html](https://prettier.io/docs/en/cli.html)

### Reviews

We invest a lot of time in carefully reviewing PRs and working with contributors to ensure that every patch merged into the master branch is correct, complete, performant, well-documented, and appropriate.

Project maintainers review each PR for the following:

- [ ] **Design.** Does it do the right thing? Is the end goal well understood and correct?
- [ ] **Correctness.** Is the logic correct? Does it behave correctly according to the goal of the feature or bug fix?
- [ ] **Fit.** Is this feature or fix in keeping with the spirit of the project? Would this idea be better implemented as an add-on?
- [ ] **Standards.** Does this change align with approved or standards-track RFCs, de-facto standards, and currently accepted best practices?
- [ ] **Tests.** Does the PR implement sufficient test coverage in terms of value inputs, platforms, and lines tested?
- [ ] **Compatibility.** Does it work across all of the project's supported runtimes and operating systems?
- [ ] **UX.** Does it provide a good UX in terms of usability, performance, design, etc.?
- [ ] **Docs.** Does this impact any existing documentation or require new documentation? If so, does this PR include the aforementioned docs, and is the language friendly, clear, helpful, and grammatically correct with no misspellings?
- [ ] **Dependencies.** Does this PR bring in any unnecessary dependencies that would prevent us from keeping the framework lean and mean, jeopardize the reliability of the project, or significantly increase the attack service?

### Debugging

To run the app in development mode, execute the following command:

```bash
$ npm start
```

Then, open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

Alternatively, you can launch the test runner in the interactive watch mode like so:

```bash
$ npm test
```

See also the section in the React docs about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Documentation

_TODO_

### Code style rules

- Format non-trivial comments using your GitHub nick and one of these prefixes:
  - TODO(riker): Damage report!
  - NOTE(riker): Well, that's certainly good to know.
  - PERF(riker): Travel time to the nearest starbase?
  - APPSEC(riker): In all trust, there is the possibility for betrayal.
- Use whitespace to separate logical blocks of code and to improve readability.
- No single-character variable names except for trivial indexes when looping,
  or in mathematical expressions implementing well-known formulas.
- Heavily document code that is especially complex and/or clever.
- When in doubt, optimize for readability.

_TODO: Add more guidelines as needed_

### Changelog

_TODO: Talk about how the changelog is generated/maintained._

### TODO

- Copyright policy / DCO
- CI/Gates
- Required skills / proficiency (contributors of all levels welcome?)
- Release process
- Security testing/auditing (appsec)

[coc]: ./CODE_OF_CONDUCT.md
