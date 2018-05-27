const autoUpdater = require('electron-updater').autoUpdater
const logger = require('electron-log')
const isDev = require('electron-is-dev')
const Raven = require('raven')
const ms = require('ms')

// Utilities
const mixpanel = require('./utils/mixpanel')
const { getUpdateChannel } = require('./utils/store')

// Set GH_TOKEN for authenticated repo read
// process.env.GH_TOKEN = 'xxxxxxxxx'
// Parcel Bundler already inlines this

const updateApp = async () => {
  if (process.env.CONNECTION === 'offline') {
    // We are offline, we stop here and check in 30 minutes
    setTimeout(updateApp, ms('30m'))
    return
  }

  try {
    // Check for updates and download them
    // then install them on quit
    await autoUpdater.checkForUpdates()
  } catch (e) {
    console.error(e)
    Raven.captureException(e)
  }
}

module.exports = () => {
  autoUpdater.logger = logger
  autoUpdater.logger.transports.file.level = 'info'
  autoUpdater.allowPrerelease = getUpdateChannel() === 'canary'

  autoUpdater.on('error', error => {
    // We report errors to console and send
    // to Sentry as well
    console.log(error)
    Raven.captureException(error)

    // Then check again for updates
    setTimeout(updateApp, ms('2h'))
  })

  autoUpdater.on('update-downloaded', ({ version }) => {
    // Track event
    mixpanel.track(null, 'Update Download', { version })
  })

  if (!isDev) {
    updateApp()
  }
}
