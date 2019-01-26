import snackbar from './snackbar'
import * as runtime from 'offline-plugin/runtime'

runtime.install({
  onInstalled() {
    console.log('The website is now offline-ready')
  },
  onUpdateReady() {
    console.log('New updates are available')
    snackbar.show(() => {
      runtime.applyUpdate()
    })
  },
  onUpdated() {
    console.log('Website is updated')
    window.location.reload()
  }
})
