<template>
  <div id="app">
    <div class="container is-center">
      <GithubCorner/>
      <h1 class="logo">
        <i class="icon heart is-large"/>logo maker
      </h1>
      <h2 class="intro">
        .........loading {{ count }} dependencies to create a simple logo....{{
        loaded ? 'loaded' : ''
        }}
      </h2>
    </div>
    <div class="container">
      <div class="field is-inline">
        <label class="inline_field">Text</label>
        <textarea class="input" rows="1" v-model="logo.text"/>
      </div>

      <div class="field is-inline">
        <label class="inline_field">Text Font</label>
        <select class="input" v-model="logo.font">
          <option
            v-for="font in fonts"
            :key="font.name"
            :value="font.name"
            :selected="logo.font === font.name"
            :disabled="font.disabled"
          >{{ font.name }}</option>
        </select>
      </div>

      <div class="field is-inline">
        <label class="inline_field">Text Size</label>
        <input class="input" type="number" v-model="logo.textSize">
      </div>

      <div class="field is-inline">
        <label class="inline_field">Text Weight</label>
        <input class="input" type="number" min="300" max="700" step="100" v-model="logo.textWeight">
      </div>

      <div class="field is-inline">
        <label class="inline_field">Text Color</label>
        <input
          v-model="logo.textColor"
          class="input"
          type="text"
          :style="{ backgroundColor: logo.textColor }"
          @click="$refs.textColorPicker.click()"
        >
        <input ref="textColorPicker" type="color" style="display: none" @input="updateTextColor">
      </div>

      <div class="field is-inline">
        <label class="inline_field">Shadow Color</label>
        <input
          v-model="logo.shadowColor"
          class="input"
          type="text"
          :style="{ backgroundColor: logo.shadowColor }"
          @click="$refs.shadowColor.click()"
        >
        <input ref="shadowColor" type="color" style="display: none" @input="updateShadowColor">
      </div>

      <div
        ref="result"
        class="result"
        :style="{
          color: logo.textColor,
          textShadow,
          fontStyle: logo.textItalic ? 'italic' : 'normal',
          fontSize: `${logo.textSize}px`,
          fontFamily: logo.font === 'system' ? null : `'${logo.font}'`,
          fontWeight: logo.textWeight,
          lineHeight: '1.1',
          textAlign: logo.textCenter ? 'center' : 'initial'
        }"
        v-html="loadingFont ? 'loading font...' : result"
      ></div>

      <div class="field">
        <label style="display:inline-block">
          <input type="checkbox" class="checkbox" v-model="logo.textItalic">
          <span>Italic</span>
        </label>
        <label style="display:inline-block">
          <input type="checkbox" class="checkbox" v-model="logo.textCenter" />
          <span>Center</span>
        </label>
      </div>

      <div class="html" v-if="showHTML">
        <pre><code>{{ html }}</code></pre>
      </div>

      <div class="actions">
        <button
          v-if="logo.text"
          class="btn is-primary"
          @click="download"
        >{{ downloading ? 'Downloading...' : 'Download Image' }}</button>
        <button class="btn" @click="showHTML = !showHTML">{{ showHTML ? 'Hide' : 'Show' }} HTML</button>
      </div>
    </div>
    <div class="footer">An
      <a href="https://egoist.sh" target="_blank">EGOIST</a> Project.
    </div>
  </div>
</template>

<script>
import toImage from 'https://unpkg.com/dom-to-image@2.6.0'
import download from 'https://unpkg.com/downloadjs@1.4.7'
import { fonts } from './fonts.eval'
import GithubCorner from './GithubCorner.vue'

export default {
  components: {
    GithubCorner
  },

  data() {
    return {
      count: 0,
      loaded: false,
      downloading: false,
      showHTML: false,
      loadingFont: false,
      fonts,

      logo: {
        text: 'EVANGELION',
        textSize: 100,
        textColor: '#05cee9',
        shadowColor: 'rgb(0, 255, 165)',
        font: 'Press Start 2P',
        textItalic: true,
        textCenter: false,
        textWeight: 500
      }
    }
  },

  computed: {
    textShadow() {
      const { shadowColor } = this.logo
      return new Array(10)
        .fill(null)
        .map((v, i) => `${shadowColor} ${i + 1}px ${i + 1}px 0px`)
        .join(', ')
    },

    result() {
      return this.logo.text.replace(/\n/g, '<br>')
    },

    html() {
      return `<div class="my-logo">${this.logo.text}</div>
<style>
.my-logo {
  color: ${this.logo.textColor};
  font-size: ${this.logo.textSize}px;
  font-family: "${
    this.logo.font === 'system'
      ? `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue`
      : this.logo.font
  }";
  font-style: ${JSON.stringify(this.logo.textItalic ? 'italic' : 'normal')};
  font-weight: ${this.logo.textWeight};
  text-shadow: ${this.textShadow};
  line-height: 1.1;
}
</style>`
    }
  },

  mounted() {
    this.interval = setInterval(() => {
      if (this.count < 30527) {
        this.count += 343
      } else {
        this.stopInterval()
      }
    }, 50)
  },

  beforeDestroy() {
    this.stopInterval()
  },

  methods: {
    download() {
      this.downloading = true
      toImage
        .toBlob(this.$refs.result)
        .then(blob => {
          download(blob, `${this.logo.text}.png`, 'image/png')
          this.downloading = false
        })
        .catch(err => {
          this.downloading = false
          console.error(err)
        })
    },

    updateTextColor(e) {
      this.logo.textColor = e.target.value
    },

    updateShadowColor(e) {
      this.logo.shadowColor = e.target.value
    },

    stopInterval() {
      if (this.interval) {
        this.loaded = true
        clearInterval(this.interval)
        this.interval = null
      }
    },

    createFontUrl(font, text) {
      const host = 'fonts.googleapis.com'
      return `https://${host}/css?family=${font.replace(/\s/g, '+')}`
    }
  },

  watch: {
    'logo.font'(font) {
      const existings = document.querySelectorAll('[data-logo-maker]')
      Array.prototype.forEach.call(existings, el => {
        el.parentNode.removeChild(el)
      })
      console.log(`...loading font`, font)
      this.loadingFont = true
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = this.createFontUrl(font, this.logo.text)
      link.crossOrigin = 'anonymous'
      link.setAttribute('data-logo-maker', true)
      link.onload = () => {
        console.log(`...loaded font`, font)
        this.loadingFont = false
      }
      link.onerror = err => {
        this.loadingFont = false
        console.log(`...failed to load font: ${font} becuase`, err)
      }
      document.head.appendChild(link)
    }
  }
}
</script>

<style>
a {
  color: inherit;
}
</style>

<style scoped>
#app {
  font-family: 'Press Start 2P', -apple-system, BlinkMacSystemFont, Segoe UI,
    Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
    sans-serif;
  margin: 20px 60px;

  @media (max-width: 768px) {
    margin: 10px;
  }
}

label {
  user-select: none;
}

.container {
  max-width: 100%;
  margin: 0 auto;
}

.logo {
  font-size: 3rem;
  display: flex;
  align-items: center;
  line-height: 70px;
}

.logo .icon {
  margin-right: 20px;
}

.intro {
  font-size: 1rem;
  color: #555;
}

.result {
  font-weight: 700;
  font-style: italic;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  margin-bottom: 20px;
}

.field:not(:last-child) {
  margin-bottom: 20px;
}

.input {
  width: 100%;
}

.footer {
  margin: 30px 0;
  text-align: center;
  font-size: 2rem;
}

.actions {
  margin-top: 20px;
}

select.input {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
}

pre {
  white-space: pre-wrap;
  color: rgb(212, 0, 255);
  line-height: 30px;
}
</style>
