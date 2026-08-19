require('dotenv').config()

const port = Number.parseInt(process.env.PORT || '3000', 10)

if (Number.isNaN(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid TCP port between 1 and 65535')
}

module.exports = {
  port,
  deleteToken: process.env.DELETE_TOKEN || 'supersecret123'
}
