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
import { Button } from '@chakra-ui/core'

const EXPORT_VERSION = 1

class Export extends React.Component {
  constructor (props) {
    super(props)
    this.text = {}
    this.state = {
      exportString: '',
      copied: false
    }
    this.updateJSONString = this.updateJSONString.bind(this)
    this.selectText = this.selectText.bind(this)
    this.copyClick = this.copyClick.bind(this)
  }

  /* Export stats in the following format:
    {
        "<origin>": {
            "serverSetsCookie": true,
            "appSendsCookie": true,
            violatedDirectives: {
                "script-src": 3
            },
            requests: {
                "<origin>": 3
            },
        },
        version: 1
    }
    */

  componentDidMount () {
    const exportString = this.updateJSONString(this.props)
    console.log(`componentDidMount: ${exportString}`)
    this.setState({ exportString })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ exportString: this.updateJSONString(nextProps) })
  }

  updateJSONString (props) {
    const exportJson = {}
    exportJson[props.appOrigin] = {
      serverSetsCookie: props.serverSetsCookie,
      appSendsCookie: props.appSendsCookie
    }
    exportJson['requests'] = {}
    props.blockedOriginsArray.forEach(origin => {
      exportJson['requests'][origin] = props.blockedOriginsCount[origin]
    })

    exportJson['violatedDirectives'] = {}
    exportJson['version'] = EXPORT_VERSION
    Object.keys(props.violatedDirectivesList).forEach(directive => {
      exportJson['violatedDirectives'][directive] =
        props.violatedDirectivesList[directive]
    })
    return JSON.stringify(exportJson)
  }

  selectText () {
    this.text.select()
  }

  copyClick (event) {
    navigator.clipboard.writeText(this.state.exportString)
    this.setState({ copied: true })
  }

  render () {
    return (
      <Button onClick={this.copyClick} size='xs' width='100%' mt='25px'>
        {this.state.copied ? 'Copied' : 'Export JSON Statistics to Clipboard'}
      </Button>
    )
  }
}

export default Export
