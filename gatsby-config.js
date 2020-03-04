const dotenv = require('dotenv')

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

module.exports = {
  siteMetadata: {
    title: `Dr. Nicole Papadopolous`,
    author: `Michael Sinclair`,
    description: `A website for Dr. Nicole Papadopolous`,
    // siteUrl: ``
  },
  plugins: [
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `nqr02billrod`,
        accessToken: process.env.CONTENTFUL_DELIVERY_API
      }
    }
  ]
}
