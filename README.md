# New Internet Extension

The New Internet Extension is a test bed for technology that we plan to ship as part of our upcoming browser.

It currently includes v1 of the Can't Be Evil Sandbox which reduces the digital footprint of web apps by implementing a same origin policy for page assets. For more information, including how to implement the sandbox on your web app or web site, [read the FAQ](docs/cant-be-evil-faq.md).

## Installation

You can install released versions from the [Chrome Web Store](https://chrome.google.com/webstore/detail/new-internet-extension/efnflbcopoianfnlmaobpofmiihhohpk) and [Firefox Browser Addons](https://addons.mozilla.org/firefox/addon/new-internet-extension/).

### Manual Installation

Distribution packages are built with node v12.16.2 and npm v6.14.4 on macOS 10.15.4 (19E287).

To build the Firefox version for manual installation run the following command and install from the `dist/` directory:

`npm run build:firefox`

To build the Chrome version for manual installation run the following command and install from the `dist/` directory:

`npm run build:chrome`
