require('dotenv').config()
const nodemailer = require('nodemailer')
const Settings = require('./agentLogic/settings')
const nml = require('./logger').child({module: __filename})

interface currentSMTP {
  dataValues?: any
}

let currentSMTP: currentSMTP = {}

async function emailService() {
  currentSMTP = await Settings.getSMTP()

  const transporter = nodemailer.createTransport({
    host: currentSMTP.dataValues.value.host,
    auth: {
      user: currentSMTP.dataValues.value.auth.user,
      pass: currentSMTP.dataValues.value.auth.pass,
    },
  })

  return transporter
}

const sendMail = async (message) => {
  const transporter = await emailService()

  nml.debug('sending email')
  transporter.sendMail(message, (error, info) => {
    if (error) {
      nml.debug('Error occurred')
      nml.debug(error.message)
    }

    nml.debug('Message sent successfully!')
    nml.debug(nodemailer.getTestMessageUrl(info))

    // Only needed when using pooled connections
    transporter.close()
  })
}

module.exports = {
  emailService,
  sendMail,
}
