/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const Immutable = require('immutable')
const {makeImmutable} = require('./immutableUtil')
const topSites = require('../../browser/api/topSites')
/**
 * topSites are defined by users. Pinned sites are attached to their positions
 * in the grid, and the non pinned indexes are populated with newly accessed sites
 */

const aboutNewTabState = {
  getSites: (state) => {
    return state.getIn(['about', 'newtab', 'sites'])
  },

  getPinnedTopSites: (state) => {
    // add same number as fallback to avoid race condition on startup
    const maxEntries = topSites.aboutNewTabMaxEntries || 100
    // we need null spaces in order to proper pin a topSite in the right position.
    // so let's set it to the same number as max new tab entries.
    return state.getIn(['about', 'newtab', 'pinnedTopSites'], Immutable.List()).setSize(maxEntries)
  },

  getIgnoredTopSites: (state) => {
    return state.getIn(['about', 'newtab', 'ignoredTopSites'], Immutable.List())
  },

  mergeDetails: (state, props) => {
    state = makeImmutable(state)
    if (!props) {
      return state
    }

    state = state.mergeIn(['about', 'newtab'], props.newTabPageDetail)
    return state.setIn(['about', 'newtab', 'updatedStamp'], new Date().getTime())
  },

  setSites: (state, topSites) => {
    if (!topSites) {
      return state
    }
    topSites = makeImmutable(topSites)
    state = state.setIn(['about', 'newtab', 'sites'], topSites)
    return state.setIn(['about', 'newtab', 'updatedStamp'], new Date().getTime())
  },

  clearTopSites: (state) => {
    state = makeImmutable(state)

    state = state.setIn(['about', 'newtab', 'sites'], makeImmutable([]))
    return state.setIn(['about', 'newtab', 'updatedStamp'], new Date().getTime())
  },

  getData: (state) => {
    return state.getIn(['about', 'newtab'], Immutable.Map())
  }
}

module.exports = aboutNewTabState
