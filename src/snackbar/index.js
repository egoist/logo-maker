import styles from './styles.module.css'

export default {
  show({ confirm, autoClose } = {}) {
    const $bar = document.createElement('div')
    $bar.className = styles.snackbar
    $bar.innerHTML = `A new version of this app is available. Click <a id="reload" href="#">here</a> to update.`
    document.body.appendChild($bar)
    $bar.classList.add(styles.show)

    $bar.querySelector('a').addEventListener('click', () => {
      confirm && confirm()
    })

    if (autoClose) {
      setTimeout(() => {
        document.body.removeChild($bar)
      }, 10000)
    }
  }
}
