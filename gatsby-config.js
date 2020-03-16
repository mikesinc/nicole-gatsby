require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Dr. Nicole Papadopoulos Private Clinical Psychologist`,
    author: `Michael Sinclair`,
    description: `Private Clinical Psychologist Counselling services by Dr. Nicole Papadopoulos in Melbourne.`,
    siteUrl: `https://drnicolepapadopoulos.netlify.com`
  },
  plugins: [
    {
      resolve: `gatsby-plugin-polyfill-io`,
      options: {
        features: [
          `Array.from`,
          `Array.prototype.map`,
          `Element.prototype.scrollIntoView`,
          `NodeList.prototype.forEach`,
          `scrollIntoView`,
          `scrollY`,
          `es7`,
          `es6`,
          `es5`
        ],
      },
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `nqr02billrod`,
        accessToken: process.env.GATSBY_CONTENTFUL_DELIVERY_API,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `GatsbyJS`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#6b37bf`,
        theme_color: `#6b37bf`,
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: `standalone`,
        icon: `src/assets/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
  ],
}
