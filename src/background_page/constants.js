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

export const PBC_BROWSER = 'https://browser.blockstack.org'
export const AUTH_PATH = '/auth'
export const AUTH_SEARCH = '?authRequest='
export const CONFIG_STORAGE_KEY = 'config'
export const APP_DATA_STORAGE_KEY = 'apps'
export const OPT_IN_HEADER_NAME = "cant-be-evil"
export const CSP_REPORT_KEY = 'cantbeevil-csp-report'

export const ICONS_GRAY = {
  '16': 'icon16-gray.png',
  '48': 'icon48-gray.png',
  '128': 'icon128-gray.png'
}

export const ICONS_COLOR = {
  '16': 'icon16.png',
  '48': 'icon48.png',
  '128': 'icon128.png'
}

export const ICONS_GRAY_EVIL = {
  '16': 'icon16-gray-evil.png',
  '48': 'icon48-gray-evil.png',
  '128': 'icon128-gray-evil.png'
}

export const ICONS_COLOR_EVIL = {
  '16': 'icon16-evil.png',
  '48': 'icon48-evil.png',
  '128': 'icon128-evil.png'
}

const CONSTANTS = {
  PBC_BROWSER,
  AUTH_PATH,
  AUTH_SEARCH,
  CONFIG_STORAGE_KEY,
  APP_DATA_STORAGE_KEY,
  OPT_IN_HEADER_NAME,
  CSP_REPORT_KEY,
  ICONS_GRAY,
  ICONS_COLOR,
  ICONS_GRAY_EVIL,
  ICONS_COLOR_EVIL
}

export default CONSTANTS
