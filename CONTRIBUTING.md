# Contributing to Vexorion

Thank you for considering contributing to Vexorion! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

1. Check if the bug already exists in [Issues](https://github.com/luxarionadm-design/vexorion/issues)
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment (Node.js version, OS, browser)
   - Code example if possible

### Suggesting Enhancements

1. Create an issue with the tag `enhancement`
2. Describe the feature and its use case
3. Provide examples of how it would be used

### Pull Requests

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Write/update tests
5. Run tests: `npm test`
6. Format code: `npm run format`
7. Lint code: `npm run lint`
8. Commit with clear message: `git commit -m "feat: add your feature"`
9. Push to your fork: `git push origin feature/your-feature-name`
10. Create a Pull Request

## Development Setup

```bash
# Clone
git clone https://github.com/luxarionadm-design/vexorion.git
cd vexorion

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode
npm run test:watch
