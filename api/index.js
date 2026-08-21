require('tsx/cjs')
const { createApp } = require('../server/src/index.ts')
const app = createApp()
module.exports = (req, res) => app(req, res)
