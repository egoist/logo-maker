import * as runtime from 'offline-plugin/runtime'
import snackbar from './snackbar'

runtime.install({
  onInstalled() {
    console.log('The website is now offline-ready')
  },
  onUpdateReady() {
    console.log('New updates are available')
    snackbar.show({
      confirm: () => {
        runtime.applyUpdate()
      },
      autoClose: true
    })
  },
  onUpdated() {
    console.log('Website is updated')
    window.location.reload()
  }
})
