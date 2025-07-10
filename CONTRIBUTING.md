# Contributing to SetGoalsToday

First off, thank you for considering contributing to SetGoalsToday! It's people like you that make SetGoalsToday such a great tool for goal achievement.

## Code of Conduct

This project and everyone participating in it is governed by the [SetGoalsToday Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@setgoalstoday.vercel.app](mailto:conduct@setgoalstoday.vercel.app).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for SetGoalsToday. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

**Before Submitting A Bug Report**

* Check the [issues](https://github.com/kachiluiz5/setgoalstoday/issues) to see if the problem has already been reported.
* Check if you can reproduce the problem in the latest version.
* Collect information about the bug:
  * Stack trace (if applicable)
  * OS, Platform and Version
  * Browser and version
  * Steps to reproduce

**How Do I Submit A (Good) Bug Report?**

Bugs are tracked as [GitHub issues](https://github.com/kachiluiz5/setgoalstoday/issues). Create an issue and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.
* **Provide specific examples to demonstrate the steps**.
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for SetGoalsToday, including completely new features and minor improvements to existing functionality.

**Before Submitting An Enhancement Suggestion**

* Check if there's already a package which provides that enhancement.
* Determine which repository the enhancement should be suggested in.
* Perform a cursory search to see if the enhancement has already been suggested.

**How Do I Submit A (Good) Enhancement Suggestion?**

Enhancement suggestions are tracked as [GitHub issues](https://github.com/kachiluiz5/setgoalstoday/issues). Create an issue and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**.
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of SetGoalsToday which the suggestion is related to.
* **Explain why this enhancement would be useful** to most SetGoalsToday users.

### Your First Code Contribution

Unsure where to begin contributing to SetGoalsToday? You can start by looking through these `beginner` and `help-wanted` issues:

* [Beginner issues](https://github.com/kachiluiz5/setgoalstoday/labels/beginner) - issues which should only require a few lines of code, and a test or two.
* [Help wanted issues](https://github.com/kachiluiz5/setgoalstoday/labels/help%20wanted) - issues which should be a bit more involved than `beginner` issues.

### Pull Requests

The process described here has several goals:

- Maintain SetGoalsToday's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible SetGoalsToday
- Enable a sustainable system for SetGoalsToday's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * 🐎 `:racehorse:` when improving performance
    * 🚱 `:non-potable_water:` when plugging memory leaks
    * 📝 `:memo:` when writing docs
    * 🐧 `:penguin:` when fixing something on Linux
    * 🍎 `:apple:` when fixing something on macOS
    * 🏁 `:checkered_flag:` when fixing something on Windows
    * 🐛 `:bug:` when fixing a bug
    * 🔥 `:fire:` when removing code or files
    * 💚 `:green_heart:` when fixing the CI build
    * ✅ `:white_check_mark:` when adding tests
    * 🔒 `:lock:` when dealing with security
    * ⬆️ `:arrow_up:` when upgrading dependencies
    * ⬇️ `:arrow_down:` when downgrading dependencies
    * 👕 `:shirt:` when removing linter warnings

### TypeScript Styleguide

All TypeScript code is linted with ESLint.

* Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
* Inline `export`s with expressions whenever possible
  \`\`\`ts
  // Use this:
  export default class ClassName {

  }

  // Instead of:
  class ClassName {

  }
  export default ClassName
  \`\`\`
* Place requires in the following order:
    * Built in Node Modules (such as `path`)
    * Built in Atom and Electron Modules (such as `atom`, `remote`)
    * Local Modules (using relative paths)
* Place class properties in the following order:
    * Class methods and properties (methods starting with `static`)
    * Instance methods and properties

### Documentation Styleguide

* Use [Markdown](https://daringfireball.net/projects/markdown/).
* Reference methods and classes in markdown with the custom `{}` notation:
    * Reference classes with `{ClassName}`
    * Reference instance methods with `{ClassName::methodName}`
    * Reference class methods with `{ClassName.methodName}`

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

[GitHub search](https://help.github.com/articles/searching-issues/) makes it easy to use labels for finding groups of issues or pull requests you're interested in.

#### Type of Issue and Issue State

* `enhancement` - Feature requests.
* `bug` - Confirmed bugs or reports that are very likely to be bugs.
* `question` - Questions more than bug reports or feature requests (e.g. how do I do X).
* `feedback` - General feedback more than bug reports or feature requests.
* `help-wanted` - The SetGoalsToday core team would appreciate help from the community in resolving these issues.
* `beginner` - Less complex issues which would be good first issues to work on for users who want to contribute to SetGoalsToday.
* `more-information-needed` - More information needs to be collected about these problems or feature requests (e.g. steps to reproduce).
* `needs-reproduction` - Likely bugs, but haven't been reliably reproduced.
* `blocked` - Issues blocked on other issues.
* `duplicate` - Issues which are duplicates of other issues, i.e. they have been reported before.
* `wontfix` - The SetGoalsToday core team has decided not to fix these issues for now, either because they're working as intended or for some other reason.
* `invalid` - Issues which aren't valid (e.g. user errors).

#### Topic Categories

* `windows` - Related to SetGoalsToday running on Windows.
* `linux` - Related to SetGoalsToday running on Linux.
* `mac` - Related to SetGoalsToday running on macOS.
* `documentation` - Related to any type of documentation.
* `performance` - Related to performance.
* `security` - Related to security.
* `ui` - Related to visual design.
* `api` - Related to SetGoalsToday's public APIs.
* `uncaught-exception` - Issues about uncaught exceptions.
* `crash` - Reports of SetGoalsToday completely crashing.
* `auto-updater` - Related to the auto-updater for all platforms.
* `installer` - Related to the installer for a platform.

## Recognition

Contributors who have made significant contributions to SetGoalsToday will be recognized in our [README](README.md) and on our website.

## Questions?

Don't hesitate to ask questions! You can:

* Open an issue on [GitHub](https://github.com/kachiluiz5/setgoalstoday/issues)
* Email us at [support@setgoalstoday.vercel.app](mailto:support@setgoalstoday.vercel.app)
* Visit our website at [https://setgoalstoday.vercel.app](https://setgoalstoday.vercel.app)

Thank you for contributing to SetGoalsToday! 🎯
