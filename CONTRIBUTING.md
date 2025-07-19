# Contributing to Rollbar.js

Thank you for your interest in contributing to Rollbar.js! We welcome contributions from the community.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/rollbar.js.git
   cd rollbar.js
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```

## Development Workflow

### Running Tests

Run all tests:
```bash
npm test
```

Run only browser tests:
```bash
npm run test-browser
```

Run only server tests:
```bash
npm run test-server
```

### Code Style

- We use ESLint for code quality. Run `npm run lint` before submitting
- Code should follow the existing style patterns in the codebase
- Use 2 spaces for indentation
- Use single quotes for strings

### Making Changes

1. Create a feature branch from `master`:
   ```bash
   git checkout -b my-feature-name
   ```

2. Make your changes and ensure:
   - All tests pass
   - Code follows our style guidelines
   - New features include appropriate tests
   - Documentation is updated if needed

3. Commit your changes with a clear message:
   ```bash
   git commit -m "Add feature: description of what you added"
   ```

## Submitting a Pull Request

1. Push your changes to your fork:
   ```bash
   git push origin my-feature-name
   ```

2. Open a pull request on GitHub against the `master` branch

3. In your pull request description:
   - Clearly describe what changes you've made
   - Reference any related issues
   - Include testing steps if applicable

4. Wait for review and address any feedback

## Reporting Issues

- Use GitHub Issues to report bugs
- Include as much detail as possible:
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Environment details (browser, Node.js version, etc.)

## Questions?

If you have questions, please:
- Check existing issues and documentation
- Open a GitHub issue for clarification
- Email support@rollbar.com for urgent matters

Thank you for contributing to Rollbar.js!