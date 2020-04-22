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

import { Flex, Stack, Tag, TagLabel, TagIcon, Text, Box } from '@chakra-ui/core'

const ModeHeader = props => (
  <Box>
    <Flex w='100%' align='center' justify='center' p={5}>
      <Stack spacing={10} isInline p='1'>
        <Tag
          variantColor={props.enforced ? 'purple' : 'gray'}
          opacity={props.enforced ? 1 : 0.5}
        >
          <TagLabel>Preventing Evil</TagLabel>
          <TagIcon icon={props.enforced ? 'check' : 'close'} size='12px' />
        </Tag>
        <Tag
          variantColor={!props.showReports ? 'gray' : 'purple'}
          opacity={props.showReports ? 1 : 0.5}
        >
          <TagLabel>Reporting Evil</TagLabel>
          <TagIcon icon={!props.showReports ? 'close' : 'check'} size='12px' />
        </Tag>
      </Stack>
    </Flex>
    <Stack>
      <Text fontSize='sm'>
        {props.enforced ? (
          'Sandbox is enabled on this site. Blocking cookies & 3rd party assets.'
        ) : (
          ''
        )}
        {props.showReports && !props.enforced ? (
          'Reporting evil behavior. Sandbox is disabled.'
        ) : (
          ''
        )}
        {!props.showReports && !props.enforced ? 'Extension is disabled.' : ''}
      </Text>
    </Stack>
  </Box>
)

export default ModeHeader
