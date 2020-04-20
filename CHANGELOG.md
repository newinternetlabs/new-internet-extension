# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
 - An additional opt-in http header - both `cant-be-evil: true` and `can't-be-evil: true` are valid
 - Support for `blob:` and `data:` protocols in the `object-src` and `connect-src` directives
 - Removed the content security policy `sandbox` directive to improve compatibility with Blockstack Connect

## [0.9.0] - 2019-11-08

Initial public release