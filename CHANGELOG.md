# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2026-08-17

### Added
- Complete test suite with Vitest
- Examples directory with Node.js and browser examples
- CONTRIBUTING.md and CODE_OF_CONDUCT.md
- GitHub Actions CI/CD pipeline
- Badges in README
- JSDoc configuration
- LICENSE file
- `engines` field in package.json

### Fixed
- Missing license file
- Missing test structure
- Incomplete package.json configuration

## [2.0.0] - 2026-08-16

### Breaking Changes
- Complete rewrite with modular architecture
- New API structure
- Removed legacy features

### Added
- UUID v6 and v7 support
- GeneratorRegistry for custom generators
- Dependency injection pattern
- Branding support with configurable prefix
- Full TypeScript support (JSDoc)
- Comprehensive test suite

### Changed
- Package name: `@luxarionadm-design/vexorion`
- Version: 2.0.0 (major version bump)
- Architecture: Singleton + Facade + Registry

### Deprecated
- All previous APIs (breaking change)

## [1.0.1] - 2025-12-01

### Added
- Initial release
- Basic UUID v4 generation
- Simple validation
- Basic formatting utilities

[2.0.1]: https://github.com/luxarionadm-design/vexorion/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/luxarionadm-design/vexorion/compare/v1.0.1...v2.0.0
[1.0.1]: https://github.com/luxarionadm-design/vexorion/releases/tag/v1.0.1
