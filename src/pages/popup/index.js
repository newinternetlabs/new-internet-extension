/**
 * Copyright 2019-2020 New Internet Labs Limited
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

import React from 'react'
import ReactDOM from 'react-dom'
import {
  Box,
  ThemeProvider,
  ColorModeProvider,
  CSSReset,
  Stack,
  Text,
  Button,
  Heading
} from '@chakra-ui/core'
import ModeHeader from './ModeHeader'
import BlockedRequests from './BlockedRequests'
import Cookies from './Cookies'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      enforced: true,
      appSendsCookie: false,
      serverSetsCookie: false,
      totalBlockedRequests: 0,
      blockedOrigins: {},
      blockedOriginsCount: {},
      violatedDirectivesList: [],
      appOrigin: '',
      reportingEnabled: true
    }

    this.enableReportingClick = this.enableReportingClick.bind(this)
  }

  componentDidMount () {
    /* bind to our backend window config object */
    chrome.runtime.getBackgroundPage(win => {
      const AppData = win.Storage.AppData
      const Config = win.Storage.Config
      const reportingEnabled = Config.isReportingEnabled()

      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const currTab = tabs[0]
        const tabId = currTab.id
        const appOrigin = new URL(currTab.url).origin

        const enforced = AppData.isEnforced(appOrigin, tabId)

        const appSendsCookie = AppData.doesAppSendCookies(appOrigin, tabId)
        const serverSetsCookie = AppData.doesServerSetCookies(appOrigin, tabId)

        const blockedOrigins = AppData.getBlockedOrigins(appOrigin, tabId)
        const blockedOriginsCount = AppData.getBlockedOriginsCount(
          appOrigin,
          tabId
        )

        const totalBlockedRequests = AppData.getBlockedURIs(appOrigin, tabId)
          .length
        const violatedDirectivesList = AppData.getViolatedDirectivesCount(
          appOrigin,
          tabId
        )
        this.setState({
          enforced,
          appSendsCookie,
          serverSetsCookie,
          blockedOrigins,
          blockedOriginsCount,
          totalBlockedRequests,
          violatedDirectivesList,
          appOrigin,
          reportingEnabled
        })
      })
    })
  }

  enableReportingClick (event) {
    console.debug('enableReportingClick')
    chrome.runtime.getBackgroundPage(win => {
      const Config = win.Storage.Config
      Config.setReportingEnabled(true)
      this.setState({ reportingEnabled: true })
    })
  }

  render () {
    const reportingEnabled = this.state.reportingEnabled
    const enforced = this.state.enforced
    const showReports = reportingEnabled || enforced
    const appSendsCookie = this.state.appSendsCookie
    const serverSetsCookie = this.state.serverSetsCookie
    const blockedOrigins = this.state.blockedOrigins
    const blockedOriginsCount = this.state.blockedOriginsCount
    const blockedOriginsArray = Object.keys(blockedOriginsCount)
    const totalBlockedRequests = this.state.totalBlockedRequests
    const violatedDirectivesList = this.state.violatedDirectivesList
    const appOrigin = this.state.appOrigin

    return (
      <Box w='100%' p='4'>
        <Stack spacing={3}>
          <Heading>Can't Be Evil Sandbox</Heading>
          <Text>Improve your privacy by blocking 3rd party assets.</Text>
        </Stack>
        <ModeHeader enforced={enforced} showReports={showReports} />
        <Box>
          {showReports ? (
            <Box>
              <Cookies
                appSendsCookie={appSendsCookie}
                serverSetsCookie={serverSetsCookie}
                reportingEnabled={reportingEnabled}
              />
              <BlockedRequests
                appSendsCookie={appSendsCookie}
                serverSetsCookie={serverSetsCookie}
                blockedOrigins={blockedOrigins}
                totalBlockedRequests={totalBlockedRequests}
                blockedOriginsArray={blockedOriginsArray}
                blockedOriginsCount={blockedOriginsCount}
                violatedDirectivesList={violatedDirectivesList}
                appOrigin={appOrigin}
              />
            </Box>
          ) : (
            <Stack p='5'>
              <Button onClick={this.enableReportingClick} variantColor='green'>
                Enable reporting of 3rd party assets for all sites.
              </Button>
            </Stack>
          )}
        </Box>
      </Box>
    )
  }
}

ReactDOM.render(
  <ThemeProvider>
    <CSSReset />
    <ColorModeProvider>
      <App />
    </ColorModeProvider>
  </ThemeProvider>,
  document.getElementById('react')
)
