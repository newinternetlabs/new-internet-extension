# Can't Be Evil Sandbox FAQ

## Does this prevent all 3rd party requests?

No! Version 1 of the Can't Be Evil Sandbox only prevents the use of 3rd party assets such as images, javascript and code from being _automatically_ loaded from servers besides the origin server. The app developer can still write code that _programmatically_ loads these assets from another server.  Future versions of the sandbox will offer increased protection.

## What's the point of only preventing the use of 3rd party assets and resources?

The current web model maximizes users' digital footprint in ways that are detrimental to user privacy and introduce a number of trusted third parties into developers' apps. We propose taking an iterative approach to addressing these practices and start with the lowest hanging fruit. Preventing the automatic use of 3rd party assets and resources moves a large amount of control and implicit apps away from 3rd parties besides the app developer. It changes the web from a world where visiting a site can result in potentially downloading assets from an unlimited number of 3rd parties before code written by the developer is even executed to a world where you’re only download assets from the app developer.

## Are apps that opt-in to the sandbox backward compatible with the web?

Yes. Apps that opt-in to the Can't Be Evil Sandbox are backwards compatible with existing web browsers. You can think of these apps as a subset of the current web.

## Will apps that opt-in to the sandbox function in browsers that have not installed the New Internet Extension?

Yes!

## What does the icon mean?

When the extension icon is gray, the sandbox is not active on the current site.

When the extension is purple, the sandbox is active and its rules are being enforced.

## Why ban cookies?

Cookies are legacy technology from the pre-JavaScript days when web apps were entirely rendered on a server. Servers control what data is stored on the user’s computer and that data is sent every time a request is made even if the developer hasn’t asked for the data. There are [better solutions for modern web apps](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

## How do I protect users of my app by opting in to the Can’t Be Evil Sandbox?
1. Make sure all of your scripts, fonts and other assets are delivered from the same origin (domain name) as your app
2. Configure your server to send the http header `can't-be-evil` with a value of `true`.

## I have more questions, where should I ask them?

[Open an issue](https://github.com/newinternetlabs/new-internet-extension/issues) on Github!