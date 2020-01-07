/**
 * Copyright 2019 New Internet Labs Limited
 *
 * This file is part of New Internet Extension (https://newinternetextension.com).
 *
 * New Internet Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * New Internet Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with New Internet Extension.  If not, see <http://www.gnu.org/licenses/>.
 */

import Storage, { currentTabURLArray } from './storage'
import { injectCspProcessor, ingestCspReport } from './csp'
import { responseCookiesProcessor, requestCookiesProcessor } from './cookies'
import { CSP_REPORT_KEY, PBC_BROWSER } from './constants'
import { enabled, updateIcon } from './utils'

const TabData = []


// browser exists on firefox not chrome
const isChrome = typeof browser === 'undefined'

function initialization () {
  console.debug('Initializing background page')
  Object.assign(window, {
    Storage,
    TabData
  })
  const enforced = enabled()
  Object.assign(window, {
    Storage,
    TabData
  })
  updateIcon(enforced)
}

initialization()

// Reset the navigation state on startup. We only want to collect data within a
// session.
chrome.runtime.onStartup.addListener(function () {
  Storage.AppData.reset()
})

chrome.webRequest.onHeadersReceived.addListener(
  injectCspProcessor,
  {
    urls: ['<all_urls>'],
    types: ['main_frame', 'sub_frame']
  },
  ['blocking', 'responseHeaders']
)

chrome.webRequest.onHeadersReceived.addListener(
  details => {
    const headers = details.responseHeaders
    const enforced = enabled(headers)
    const tabId = details.tabId
    const appOrigin = new URL(details.url).origin
    Storage.AppData.setEnforced(appOrigin, tabId, enforced)
    updateIcon(enforced)
  },
  {
    urls: ['<all_urls>'],
    types: ['main_frame', 'sub_frame']
  },
  ['blocking', 'responseHeaders']
)

const responseCookiesOptions = ['responseHeaders']
if (isChrome) {
  responseCookiesOptions.push('extraHeaders')
}

chrome.webRequest.onHeadersReceived.addListener(
  responseCookiesProcessor,
  {
    urls: ['<all_urls>'],
    types: ['main_frame', 'sub_frame']
  },
  responseCookiesOptions
)

const requestCookiesOptions = ['blocking', 'requestHeaders']
if (isChrome) {
  requestCookiesOptions.push('extraHeaders')
}
chrome.webRequest.onBeforeSendHeaders.addListener(
  requestCookiesProcessor,
  {
    urls: ['<all_urls>'],
    types: ['main_frame', 'sub_frame']
  },
  requestCookiesOptions
)

chrome.webRequest.onBeforeRequest.addListener(
  ingestCspReport,
  { urls: [`*://*/${CSP_REPORT_KEY}`] },
  ['blocking', 'requestBody']
)

chrome.webNavigation.onBeforeNavigate.addListener(data => {
  if (typeof data) {
    console.log('onBeforeNavigate')
    console.log(data)
    if (data.parentFrameId < 0) {
      // main frame
      console.log('reseting app data')
      Storage.AppData.reset()
      const tabId = data.tabId
      const currentTabURLString = currentTabURLArray[tabId]

      if (currentTabURLString) {
        const currentTabURL = new URL(currentTabURLString)
        const currentOrigin = currentTabURL.origin

        const nextURL = new URL(data.url)
        const nextOrigin = nextURL.origin
        console.debug(`currentOrigin: ${currentOrigin}. nextOrigin: ${nextOrigin}`)
        if (nextOrigin === PBC_BROWSER) {
          console.debug('Redirecting to Blockstack authenticator')
        } else if (nextOrigin !== currentOrigin) {
          // chrome.tabs.executeScript(tabId, { code: "alert('Changing origins.')"})
          // chrome.tabs.update(tabId), { url: currentTabURLString }
          chrome.notifications.create({
            type: 'basic',
            iconUrl: null,
            title:'Origin Change',
            message: `Current: ${currentOrigin}.\nNext: ${nextOrigin}`
        });
        }



      } else {
        console.debug(`No current url found for tab id ${tabId}`)
      }
    }
  } else console.error(chrome.i18n.getMessage('inHandlerError'), e)
})

chrome.webNavigation.onCommitted.addListener(data => {
  if (typeof data) {
    console.log('onCommitted')
    console.log(data)
    if (data.parentFrameId < 0) { // 
      const tabId = data.tabId
      const url = data.url
      currentTabURLArray[tabId] = url
    }
    
  } else console.error(chrome.i18n.getMessage('inHandlerError'), e)
})
