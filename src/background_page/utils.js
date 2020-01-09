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

import {
  OPT_IN_HEADER_NAME,
  ICONS_COLOR,
  ICONS_GRAY,
  ICONS_GRAY_EVIL,
  ICONS_COLOR_EVIL
} from './constants'
import { Config } from './storage'

export const removeHeaders = (headers, headersToRemove) => {
  const headersToRemoveLowerCase = headersToRemove.map(h => h.toLowerCase())

  // remove a list of response headers from the request object
  let i = headers.length
  while (i > 0) {
    i -= 1
    if (headersToRemoveLowerCase.includes(headers[i].name.toLowerCase())) {
      headers.splice(i, 1)
    }
  }

  return headers
}

export function getHeaderValue (headerName, headers) {
  for (var i = 0; i < headers.length; ++i) {
    if (headers[i].name.toLowerCase() === headerName.toLowerCase()) {
      return headers[i].value
    }
  }
  return undefined
}

/**
 * Returns true if the `cant-be-evil` header exists and is set to `true`,
 * otherwise false
 * @param {Array} headers
 */
export function hasOptInNotEvilHeader (headers) {
  let i = headers.length
  while (i > 0) {
    i -= 1
    if (headers[i].name.toLowerCase() === OPT_IN_HEADER_NAME) {
      const value = headers[i].value
      if (value.toLowerCase() === 'true') {
        return true
      }
    }
  }
  return false
}

export function enabled (headers) {
  if (!headers) {
    headers = []
  }
  return Config.isAllSitesEnabled() || hasOptInNotEvilHeader(headers)
}

const transparentColor = 'rgba(0,0,0,0)'
export function updateIcon (enforced, compliant, tabId) {
  console.debug(
    `updateIcon: enforced: ${enforced} compliant: ${compliant} tabId: ${tabId}`
  )

  if (enforced) {
    console.debug('enforced icon')
    if (compliant === false) {
      chrome.browserAction.setIcon({ path: ICONS_COLOR_EVIL, tabId })
    } else {
      chrome.browserAction.setIcon({ path: ICONS_COLOR, tabId })
    }
  } else {
    console.debug('report only icon')
    if (compliant === false) {
      chrome.browserAction.setIcon({ path: ICONS_GRAY_EVIL, tabId })
    } else {
      chrome.browserAction.setIcon({ path: ICONS_GRAY, tabId })
    }
  }
}
