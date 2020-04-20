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

import React from 'react'
import ReactDOM from 'react-dom'
import {
  Stack,
  Checkbox,
  Heading,
  ThemeProvider,
  ColorModeProvider,
  CSSReset,
  Text
} from '@chakra-ui/core'
import { OPT_IN_HEADER_NAMES } from '../../background_page/constants'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      allSites: false,
      reportingEnabled: true
    }
    this.allSitesChanged = this.allSitesChanged.bind(this)
    this.reportingChanged = this.reportingChanged.bind(this)
  }

  allSitesChanged (event) {
    console.log('allSitesChanged')
    const allSites = event.target.checked
    this.Config.setAllSitesEnabled(allSites)
    this.setState({ allSites })
  }

  reportingChanged (event) {
    console.log('reportingChanged')
    const reportingEnabled = event.target.checked
    this.Config.setReportingEnabled(reportingEnabled)
    this.setState({ reportingEnabled })
  }

  componentDidMount () {
    /* bind to our backend window config object */
    chrome.runtime.getBackgroundPage(win => {
      this.Config = win.Storage.Config
      const allSites = this.Config.isAllSitesEnabled()
      const reportingEnabled = this.Config.isReportingEnabled()
      this.setState({ allSites, reportingEnabled })
    })
  }

  render () {
    const reportingEnabled = this.state.reportingEnabled
    const allSites = this.state.allSites
    return (
      <Stack spacing={5}>
        <Heading as='h1'>New Internet Extension</Heading>
        <Heading as='h2'>Can't Be Evil Sandbox</Heading>
        <Text>
          The sandbox is enabled by default on sites that opt in by sending the
          HTTP header <code>{OPT_IN_HEADER_NAMES}: false</code>
        </Text>
        <Checkbox isChecked={allSites} onChange={this.allSitesChanged}>
          Enable enforcement for all sites
        </Checkbox>
        <Checkbox isChecked={reportingEnabled} onChange={this.reportingChanged}>
          Enable reporting for all sites
        </Checkbox>
      </Stack>
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
