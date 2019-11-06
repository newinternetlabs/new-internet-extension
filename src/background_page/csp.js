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

import { removeHeaders, enabled, updateIcon } from './utils'
import { OPT_IN_HEADER_NAME } from './constants'
import { AppData, tabDataArray, Config } from './storage'
import { CSP_REPORT_KEY } from './constants'

export function injectCspProcessor (details) {
  console.debug('injectCspProcessor')
  let headers = details.responseHeaders
  const tabId = details.tabId

  const enforce = enabled(headers)
  tabDataArray[tabId] = { enforce, compliant: true }

  const sandboxCsp = 'sandbox allow-scripts allow-same-origin;'
  const scriptCsp =
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src-elem 'self' 'unsafe-inline' 'unsafe-eval';"
  const styleCsp =
    "style-src 'self' 'unsafe-inline' data: blob:; style-src-elem 'self' 'unsafe-inline';"
  const imageCsp = "img-src 'self' data: blob:;"
  const fontCsp = "font-src 'self' data: blob:;"
  const mediaCsp = "media-src 'self' data: blob:;"
  const objectCsp = "object-src 'self';"
  const prefetchCsp = "prefetch-src 'self';"
  // const childCsp = "child-src 'self' data: blob: blockstack:;"
  const frameCsp = "frame-src 'self' data: blob: blockstack:;"
  const workerCsp = "worker-src 'self' data: blob:;"
  const formActionCsp = "form-action 'self';"
  const manifestCsp = "manifest-src 'self';"
  const disownOpener = 'disown-opener;'
  const connectCsp = 'connect-src *;'
  const reportUri = `report-uri /${CSP_REPORT_KEY}`

  const reportingEnabled = Config.isReportingEnabled()
  const includeReportDirective = enforce || reportingEnabled
  const cspValue = `default-src 'none'; ${sandboxCsp} ${scriptCsp} ${styleCsp} ${imageCsp} ${fontCsp} ${mediaCsp} ${objectCsp} ${prefetchCsp} ${frameCsp} ${workerCsp} ${formActionCsp} ${manifestCsp} ${disownOpener} ${connectCsp} ${includeReportDirective
    ? reportUri
    : ''}`

  if (enforce) {
    const headersList = [
      'content-security-policy',
      'content-security-policy-report-only',
      'x-webkit-csp'
    ]
    headers = removeHeaders(headers, headersList)

    console.debug('Enforcement enabled: Injecting CSP in response.')
    const cspHeaderObject = {
      name: 'content-security-policy',
      value: cspValue
    }
    headers.push(cspHeaderObject)
  } else {
    if (reportingEnabled) {
      console.debug(
        'Enforcement disabled: Injecting report-only CSP in response.'
      )
      const headersList = ['content-security-policy-report-only']
      headers = removeHeaders(headers, headersList)
      const cspHeaderReportObject = {
        name: 'content-security-policy-report-only',
        value: cspValue
      }
      headers.push(cspHeaderReportObject)
    } else {
      console.debug(
        'Enforcement disabled: Reporting also disabled. Doing nothing.'
      )
    }
  }
  return { responseHeaders: headers }
}

export function ingestCspReport (request) {
  console.debug('ingestCspReport')
  const cancel = { cancel: true }
  const decoder = new TextDecoder('utf8')
  // parse the CSP report
  const report = JSON.parse(decoder.decode(request.requestBody.raw[0].bytes))[
    'csp-report'
  ]
  console.log(report)
  const directive = report['violated-directive'].split(' ')[0]
  const origin = new URL(report['document-uri']).origin
  const blockedUri = report['blocked-uri']
  const tabId = request.tabId
  AppData.addBlockedURI(origin, blockedUri, directive, tabId)
  tabDataArray[tabId]['compliant'] = false
  updateIcon(
    tabDataArray[tabId]['enforce'],
    tabDataArray[tabId]['compliant'],
    tabId
  )
  return cancel
}
