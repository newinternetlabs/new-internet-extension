# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2020-05-06

### Changed
 - Improvements to the options dialog to make it look better on Chrome #32
 - Don't report attempted cookies on sites that opt-in to the sandbox since many do not have control over cookies #19

## [0.9.1] - 2020-04-22

### Added
 - An additional opt-in http header - both `cant-be-evil: true` and `can't-be-evil: true` are valid
 - Support for `blob:` and `data:` protocols in the `object-src` and `connect-src` directives
 - Removed the content security policy `sandbox` directive to improve compatibility with Blockstack Connect
 - Build environment versions to verify that builds are reproducible for the Mozilla add-on review team

## [0.9.0] - 2019-11-08

Initial public release
