require('dotenv').config()
const nodemailer = require('nodemailer')
const Settings = require('./agentLogic/settings')

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

  console.log('sending email')
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log('Error occurred')
      console.log(error.message)
    }

    console.log('Message sent successfully!')
    console.log(nodemailer.getTestMessageUrl(info))

    // Only needed when using pooled connections
    transporter.close()
  })
}

module.exports = {
  emailService,
  sendMail,
}
