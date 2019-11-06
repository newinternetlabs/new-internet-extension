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
import {
  Box,
  Stack,
  Tag,
  TagLabel,
  TagIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  Badge,
  Text
} from '@chakra-ui/core'
import Export from './Export'

const directiveStrings = {
  'img-src': {
    name: 'Images'
  },
  'script-src': {
    name: 'Scripts'
  },
  'script-src-elem': {
    name: 'Scripts'
  },
  'frame-src': {
    name: 'Frames'
  },
  'font-src': {
    name: 'Fonts'
  },
  'style-src': {
    name: 'Styles'
  },
  'style-src-elem': {
    name: 'Styles'
  },
  'default-src': {
    name: 'Other'
  },
  'media-src': {
    name: 'Media'
  },
  'object-src': {
    name: 'Objects'
  },
  'prefetch-src': {
    name: 'Prefetch'
  },
  'worker-src': {
    name: 'Workers'
  },
  'form-action': {
    name: 'Forms'
  },
  'manifest-src': {
    name: 'Manifests'
  }
}

const BlockedRequests = props => (
  <Box w='100%'>
    {props.totalBlockedRequests === 0 ? (
      <Stack spacing={2} isInline p='1'>
        <Tag variantColor='purple' size='sm'>
          <TagLabel>No 3rd party assets</TagLabel>
          <TagIcon icon='check' />
        </Tag>
      </Stack>
    ) : null}
    {props.totalBlockedRequests !== 0 ? (
      <Stack spacing={2} isInline p='1'>
        <Tag variantColor='red' size='sm'>
          <TagLabel>Requested 3rd party assets</TagLabel>
          <TagIcon icon='warning-2' />
        </Tag>
      </Stack>
    ) : null}
    <Accordion allowMultiple mt='3'>
      <AccordionItem>
        <AccordionHeader>
          <Box flex='1' textAlign='left'>
            {props.totalBlockedRequests} request{props.totalBlockedRequests === 1 ? '' : 's'}{' '}
            for 3rd party assets
          </Box>
          <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel pb={4}>
          <Text textAlign='center'>
            {props.blockedOriginsArray.length === 0 ? (
              'Yay! This site loads no 3rd party assets.'
            ) : (
              ''
            )}
          </Text>
          <StatGroup>
            {Object.keys(props.violatedDirectivesList).map(directive => {
              return (
                <Stat key={directive}>
                  <StatLabel>
                    {directive in directiveStrings ? (
                      directiveStrings[directive].name
                    ) : (
                      directive
                    )}
                  </StatLabel>
                  <StatNumber>
                    {props.violatedDirectivesList[directive]}
                  </StatNumber>
                </Stat>
              )
            })}
          </StatGroup>
          <List spacing={3} mt='3'>
            {props.blockedOriginsArray.map(origin => {
              return (
                <ListItem isTruncated key={origin}>
                  {origin} &nbsp;
                  <Badge>
                    {props.blockedOriginsCount[origin]} request{props.blockedOriginsCount[origin] === 1 ? '' : 's'}
                  </Badge>
                </ListItem>
              )
            })}
          </List>
          <Export
            appSendsCookie={props.appSendsCookie}
            serverSetsCookie={props.serverSetsCookie}
            blockedOriginsArray={props.blockedOriginsArray}
            blockedOriginsCount={props.blockedOriginsCount}
            violatedDirectivesList={props.violatedDirectivesList}
            appOrigin={props.appOrigin}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  </Box>
)

export default BlockedRequests
