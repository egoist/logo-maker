<template>
  <div id="app">
    <div class="container is-center">
      <GithubCorner />
      <h1 class="logo"><i class="icon heart is-large" />logo maker</h1>
      <h2 class="intro">
        .........loading {{ count }} dependencies to create a simple logo....{{
          loaded ? 'loaded' : ''
        }}
      </h2>
    </div>
    <div class="container">
      <div class="field is-inline">
        <label class="inline_field">Text</label>
        <textarea class="input" rows="1" v-model="logo.text" />
      </div>

      <div class="field is-inline">
        <label class="inline_field">Text Font</label>
        <select class="input" v-model="logo.font">
          <option value="Press Start 2P">Press Start 2P</option>
          <option value="system">System Font</option>
        </select>
      </div>

      <div class="field is-inline">
        <label class="inline_field">Text Size</label>
        <input class="input" type="number" v-model="logo.textSize" />
      </div>

      <div class="field is-inline">
        <label class="inline_field">Text Color</label>
        <input
          v-model="logo.textColor"
          class="input"
          type="text"
          :style="{ backgroundColor: logo.textColor }"
          @click="$refs.textColorPicker.click()"
        />
        <input
          ref="textColorPicker"
          type="color"
          style="display: none"
          @input="updateTextColor"
        />
      </div>

      <div class="field is-inline">
        <label class="inline_field">Shadow Color</label>
        <input
          v-model="logo.shadowColor"
          class="input"
          type="text"
          :style="{ backgroundColor: logo.shadowColor }"
          @click="$refs.shadowColor.click()"
        />
        <input
          ref="shadowColor"
          type="color"
          style="display: none"
          @input="updateShadowColor"
        />
      </div>

      <div
        ref="result"
        class="result"
        :style="{
          color: logo.textColor,
          textShadow,
          fontSize: `${logo.textSize}px`,
          fontFamily: logo.font === 'system' ? null : `'${logo.font}'`
        }"
        v-html="result"
      ></div>

      <div class="html" v-if="showHTML">
        <pre><code>{{ html }}</code></pre>
      </div>

      <div class="actions">
        <button v-if="logo.text" class="btn is-primary" @click="download">
          {{ downloading ? 'Downloading...' : 'Download Image' }}
        </button>
        <button class="btn" @click="showHTML = !showHTML">
          {{ showHTML ? 'Hide' : 'Show' }} HTML
        </button>
      </div>
    </div>
    <div class="footer">
      An <a href="https://egoist.sh" target="_blank">EGOIST</a> Project.
    </div>
  </div>
</template>

<script>
import toImage from 'dom-to-image'
import download from 'downloadjs'
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

      logo: {
        text: 'EVANGELION',
        textSize: 100,
        textColor: '#05cee9',
        shadowColor: 'rgb(0, 255, 165)',
        font: 'Press Start 2P'
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
      : 'Press Start 2P'
  }";
  font-style: italic;
  text-shadow: ${this.textShadow};
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
