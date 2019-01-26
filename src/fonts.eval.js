const url = require('url')
const fetch = require('node-fetch')
const tunnel = require('tunnel')

module.exports = async () => {
  const parsedUrl =
    process.env.POI_APP_HTTP_PROXY && url.parse(process.env.POI_APP_HTTP_PROXY)
  const { items } = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${
      process.env.POI_APP_GOOGLE_FONT_API_KEY
    }`,
    {
      agent:
        parsedUrl &&
        tunnel.httpsOverHttp({
          proxy: {
            host: parsedUrl.hostname,
            port: parsedUrl.port
          }
        })
    }
  ).then(res => res.json())

  return {
    fonts: groupFonts(items)
  }
}

function groupFonts(fonts) {
  const categories = {}
  for (const font of fonts) {
    categories[font.category] = categories[font.category] || []
    categories[font.category].push({ name: font.family })
  }
  return Object.keys(categories).reduce((res, category) => {
    return [...res, { disabled: true, name: category }, ...categories[category]]
  }, [])
}
