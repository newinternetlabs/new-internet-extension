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

import { CONFIG_STORAGE_KEY, APP_DATA_STORAGE_KEY } from './constants'

const BLANK_APP_DATA = {
  blockedURIs: [],
  appSendsCookie: [],
  serverSetsCookie: [],
  enforced: []
}

/**
 * Takes an array of URI strings and returns an object
 * where keys are origins and values are arrays of blocked URIs
 * @param {Array<string>} blockedURIArray
 */
function generateOriginLists (blockedURIArray) {
  const originList = {}
  blockedURIArray.forEach(uri => {
    let origin = ''
    try {
      origin = new URL(uri).origin
    } catch (e) {
      // handles eval, inline, etc
      origin = uri
    }
    if (!originList[origin]) {
      originList[origin] = []
    }
    originList[origin].push(uri)
  })
  return originList
}

export class AppData {
  static save (apps) {
    console.log(apps)
    localStorage.setItem(APP_DATA_STORAGE_KEY, JSON.stringify(apps))
  }

  static load () {
    const stringData = localStorage.getItem(APP_DATA_STORAGE_KEY)
    return stringData ? JSON.parse(stringData) : {}
  }

  static reset () {
    localStorage.removeItem(APP_DATA_STORAGE_KEY)
  }

  static saveAppData (appOrigin, appData) {
    const apps = this.load()
    apps[appOrigin] = appData
    this.save(apps)
  }

  static getAppData (appOrigin) {
    const apps = this.load()
    const appData = apps[appOrigin]

    return appData || Object.assign({}, BLANK_APP_DATA)
  }

  static setEnforced (appOrigin, tabId, enforced) {
    const appData = this.getAppData(appOrigin)
    appData.enforced[tabId] = enforced
    this.saveAppData(appOrigin, appData)
  }

  static isEnforced (appOrigin, tabId) {
    const appData = this.getAppData(appOrigin)
    return appData.enforced[tabId]
  }

  static addBlockedURI (appOrigin, blockedURI, violatedDirective, tabId) {
    const appData = this.getAppData(appOrigin)
    const blockedURIData = {
      blockedURI,
      violatedDirective,
      tabId
    }
    appData.blockedURIs.push(blockedURIData)
    this.saveAppData(appOrigin, appData)
  }

  static appSendsCookie (appOrigin, tabId) {
    const appData = this.getAppData(appOrigin)
    appData.appSendsCookie.push(tabId)
    this.saveAppData(appOrigin, appData)
  }

  static serverSetsCookie (appOrigin, tabId) {
    const appData = this.getAppData(appOrigin)
    appData.serverSetsCookie.push(tabId)
    this.saveAppData(appOrigin, appData)
  }

  static doesServerSetCookies (appOrigin, tabId) {
    const appData = this.getAppData(appOrigin)
    return appData.serverSetsCookie.includes(tabId)
  }

  static doesAppSendCookies (appOrigin, tabId) {
    const appData = this.getAppData(appOrigin)
    return appData.appSendsCookie.includes(tabId)
  }

  static getBlockedURIs (appOrigin, tabId) {
    const blockedURIs = this.getAppData(appOrigin).blockedURIs
    return blockedURIs.filter(blockedURI => {
      if (tabId) {
        const keepElement = blockedURI.tabId === tabId
        console.log(
          `blockedURI.tabId: ${blockedURI.tabId}; tabId: ${tabId} keepElement: ${keepElement}`
        )
        return keepElement
      } else {
        return false
      }
    })
  }

  static getBlockedOrigins (appOrigin, tabId) {
    const blockedURIs = this.getBlockedURIs(appOrigin, tabId)
    // generates an array of strings
    const blockedURIArray = blockedURIs.map(blockedURI => blockedURI.blockedURI)
    return generateOriginLists(blockedURIArray)
  }

  static getBlockedOriginsCount (appOrigin, tabId) {
    const blockedOrigins = this.getBlockedOrigins(appOrigin, tabId)
    const blockedOriginsList = Object.keys(blockedOrigins)
    const countObject = {}
    blockedOriginsList.forEach(origin => {
      countObject[origin] = blockedOrigins[origin].length
    })
    return countObject
  }

  static getViolatedDirectivesCount (appOrigin, tabId) {
    console.log(
      `getViolatedDirectivesCount: appOrigin: ${appOrigin} tabId: ${tabId}`
    )
    const blockedURIs = this.getBlockedURIs(appOrigin, tabId)
    console.log(blockedURIs)
    const blockedOriginsList = Object.keys(blockedURIs)
    const directiveCountObject = {}
    blockedOriginsList.forEach(origin => {
      const violatedDirective = blockedURIs[origin].violatedDirective
      console.log(`origin: ${origin} violatedDirective: ${violatedDirective}`)
      const count = directiveCountObject[violatedDirective]
      directiveCountObject[violatedDirective] = count ? count + 1 : 1
    })
    return directiveCountObject
  }
}

export const tabDataArray = []

const ALL_SITES_KEY = 'allSites'
const REPORTING_ENABLED_KEY = 'reportingEnabled'

export class Config {
  static defaultConfig = () => {
    return Object.assign(
      {},
      {
        allSites: false,
        reportingEnabled: true
      }
    )
  }
  static get (key) {
    const localConfig = this.getConfig()
    return localConfig[key]
  }

  static getConfig () {
    let localConfig = localStorage.getItem(CONFIG_STORAGE_KEY)
    return localConfig ? JSON.parse(localConfig) : this.defaultConfig()
  }

  static set (key, value) {
    const localConfig = this.getConfig()
    localConfig[key] = value
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(localConfig))
    return localConfig
  }

  static isAllSitesEnabled () {
    return Config.get(ALL_SITES_KEY)
  }

  static setAllSitesEnabled (enabled) {
    this.set(ALL_SITES_KEY, enabled)
  }

  static isReportingEnabled () {
    return Config.get(REPORTING_ENABLED_KEY)
  }

  static setReportingEnabled (enabled) {
    this.set(REPORTING_ENABLED_KEY, enabled)
  }
}

const Storage = {
  AppData,
  Config
}

export default Storage
