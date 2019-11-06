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

import { removeHeaders, enabled, getHeaderValue } from './utils'
import { AppData, Config } from './storage'

export function responseCookiesProcessor (details) {
  let headers = details.responseHeaders
  const enforce = enabled(headers)
  const report = enforce || Config.isReportingEnabled()
  if (!report) {
    console.debug(
      'responseCookiesProcessor: enforcement and reporting disabled. Doing nothing.'
    )
    return { responseHeaders: headers }
  }
  if (getHeaderValue('set-cookie', headers)) {
    console.debug('responseCookiesProcessor: response sets cookie')
    const tabId = details.tabId
    const appOrigin = new URL(details.url).origin
    AppData.serverSetsCookie(appOrigin, tabId)
  }

  const headersList = ['cookies']
  if (enforce) {
    console.debug('Enforcement enabled: Removing set-cookie from response.')
    headers = removeHeaders(headers, headersList)
  }
  return { responseHeaders: headers }
}

export function requestCookiesProcessor (details) {
  let headers = details.requestHeaders
  const enforce = enabled(headers)
  const report = enforce || Config.isReportingEnabled()

  if (!report) {
    console.debug(
      'requestCookiesProcessor: enforcement and reporting disabled. Doing nothing.'
    )
    return { requestHeaders: headers }
  }

  if (getHeaderValue('cookie', headers)) {
    console.debug('requestCookiesProcessor: app is trying to send cookie')
    const tabId = details.tabId
    const appOrigin = new URL(details.url).origin
    AppData.appSendsCookie(appOrigin, tabId)
  }

  const headersList = ['cookie']
  if (enforce) {
    console.debug('Enforcement enabled: Removing cookie from request.')
    headers = removeHeaders(headers, headersList)
  }
  return { requestHeaders: headers }
}
