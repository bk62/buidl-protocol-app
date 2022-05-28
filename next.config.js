module.exports = {
  async rewrites() {
    return [
      {
        source: '/profiles/id/:handleOrId',
        destination: '/profiles/:handleOrId?isId=true',
      },
      {
        source: '/projects/id/:handleOrId',
        destination: '/projects/:handleOrId?isId=true',
      },
    ]
  },
}