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
import { Box, Stack, Tag, TagLabel, TagIcon } from '@chakra-ui/core'

class Cookies extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const props = this.props
    const cookieWarningTags = []
    if (props.serverSetsCookie && !props.enforced) {
      cookieWarningTags.push(
        <Tag variantColor='red' size='sm' key='1'>
          <TagLabel>Server sent cookies</TagLabel>
          <TagIcon icon='warning-2' />
        </Tag>
      )
    }

    if (props.appSendsCookie && !props.enforced) {
      cookieWarningTags.push(
        <Tag variantColor='red' size='sm' key='2'>
          <TagLabel>App sent cookies</TagLabel>
          <TagIcon icon='warning-2' />
        </Tag>
      )
    }
    return (
      <Box w='100%'>
        {(!props.appSendsCookie && !props.serverSetsCookie) ||
        props.enforced ? (
          <Stack spacing={2} isInline p='1'>
              <Tag variantColor='purple' size='sm'>
              <TagLabel>No cookies</TagLabel>
              <TagIcon icon='check' />
            </Tag>
            </Stack>
          ) : (
            <Stack spacing={2} isInline p='1'>
              {cookieWarningTags}
            </Stack>
          )}
      </Box>
    )
  }
}

export default Cookies
