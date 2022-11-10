export{}
const bcrypt = require('bcryptjs')
require('dotenv').config()

const jwt = require('jsonwebtoken')
const NodeMailer = require('../nodeMailer')
const SMTP = require('./settings')
import {Utils} from '../util'

const Websockets = require('../websockets.ts')
import * as Users from '../orm/users'

// New Account Email
export async function sendEmailNewAccount (from, to, organization, token) {
  const link = process.env.WEB_ROOT + `/account-setup/#${token}`

  const emailNewAccount = `
  <style type="text/css">
    .tg  {border:none;border-collapse:collapse;border-spacing:0;margin:0px auto;}
    .tg td{border-style:solid;border-width:0px;font-family:Arial, sans-serif;font-size:1vw;overflow:hidden;
      padding:10px 5px;word-break:normal;}
    .tg th{border-style:solid;border-width:0px;font-family:Arial, sans-serif;font-size:1vw;font-weight:normal;
      overflow:hidden;padding:10px 5px;word-break:normal;}
    .tg .tg-zv4m{border-color:#ffffff;text-align:left;vertical-align:top}
    .tg .tg-n3mx{border-color:#ffffff;color:#333333;font-size:1vw;text-align:left;vertical-align:top}
    .tg .tg-b5gb{border-color:#ffffff;font-size:1vw;text-align:left;vertical-align:top}
    .tg .tg-vpu8{border-color:#ffffff;font-family:Arial, Helvetica, sans-serif !important;;font-size:1vw;text-align:left;
      vertical-align:top}
    .tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
    .tg .tg-bq5v{border-color:inherit;font-size:1vw;text-align:left;vertical-align:top}
    .tg .tg-il3a{border-color:#ffffff;color:#ffffff;text-align:left;vertical-align:top}
    @media screen and (max-width: 767px) {.tg {width: auto !important;}.tg col {width: auto !important;}.tg-wrap {overflow-x: auto;-webkit-overflow-scrolling: touch;margin: auto 0px;}}
  </style>
  <div class="tg-wrap">
    <table class="tg" style="undefined;table-layout: fixed; width: 1144px">
      <colgroup>
        <col style="width: 147px">
        <col style="width: 832px">
        <col style="width: 165px">
      </colgroup>
      <tbody>
        <tr>
          <td class="tg-zv4m"></td>
          <td class="tg-b5gb"><br><br><br></td>
          <td class="tg-zv4m"></td>
        </tr>
        <tr>
          <td class="tg-zv4m"></td>
          <td class="tg-b5gb" style="font-size:1.5vw">Welcome!<br><br></td>
          <td class="tg-zv4m"></td>
        </tr>
        <tr>
          <td class="tg-0pky"></td>
          <td class="tg-bq5v" style="font-size:1vw">You've been invited to create an account on the ${organization} system. <br><br></td>
          <td class="tg-0pky"></td>
        </tr>
        <tr>
          <td class="tg-il3a"></td>
          <td class="tg-n3mx" style="font-size:1vw">Please click <a href="${link}">here</a> to choose your settings and get started (or copy and paste the link below).<br><br></td>
          <td class="tg-il3a"></td>
        </tr>
        <tr>
          <td class="tg-zv4m"></td>
          <td class="tg-b5gb" style="font-size:1vw">${link}<br><br></td>
          <td class="tg-zv4m"></td>
        </tr>
        <tr>
          <td class="tg-zv4m"></td>
          <td class="tg-b5gb" style="font-size:1vw">This link will expire in 24 hours.<br><br></td>
          <td class="tg-zv4m"></td>
        </tr>
        <tr>
          <td class="tg-0pky"></td>
          <td class="tg-bq5v" style="font-size:1vw">Thank you,<br></td>
          <td class="tg-0pky"></td>
        </tr>
        <tr>
          <td class="tg-0pky"></td>
          <td class="tg-bq5v" style="font-size:1.5vw;font-weight:bold">${organization}<br></td>
          <td class="tg-0pky"></td>
        </tr>
        <tr>
          <td class="tg-zv4m"></td>
          <td class="tg-b5gb"><br><br></td>
          <td class="tg-zv4m"></td>
        </tr>
      </tbody>
    </table>
  </div>`

  await NodeMailer.sendMail({
    from: from,
    to: to,
    subject: `${organization} Enterprise Agent Account Registration`,
    html: emailNewAccount,
  })
}

// Password Reset Email
export async function sendEmailPasswordReset(
  from,
  to,
  organization,
  token,
) {
  const link = process.env.WEB_ROOT + `/password-reset/#${token}`

  const emailPasswordReset = `
  <style type="text/css">
    .tg  {border:none;border-collapse:collapse;border-spacing:0;margin:0px auto;}
    .tg td{border-style:solid;border-width:0px;font-family:Arial, sans-serif;font-size:1vw;overflow:hidden;
      padding:10px 5px;word-break:normal;}
    .tg th{border-style:solid;border-width:0px;font-family:Arial, sans-serif;font-size:1vw;font-weight:normal;
      overflow:hidden;padding:10px 5px;word-break:normal;}
    .tg .tg-zv4m{border-color:#ffffff;text-align:left;vertical-align:top}
    .tg .tg-n3mx{border-color:#ffffff;color:#333333;font-size:1vw;text-align:left;vertical-align:top}
    .tg .tg-b5gb{border-color:#ffffff;font-size:1vw;text-align:left;vertical-align:top}
    .tg .tg-vpu8{border-color:#ffffff;font-family:Arial, Helvetica, sans-serif !important;;font-size:1vw;text-align:left;
      vertical-align:top}
    .tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
    .tg .tg-bq5v{border-color:inherit;font-size:1vw;text-align:left;vertical-align:top}
    .tg .tg-il3a{border-color:#ffffff;color:#ffffff;text-align:left;vertical-align:top}
    @media screen and (max-width: 767px) {.tg {width: auto !important;}.tg col {width: auto !important;}.tg-wrap {overflow-x: auto;-webkit-overflow-scrolling: touch;margin: auto 0px;}}
  </style>
  <div class="tg-wrap">
    <table class="tg" style="undefined;table-layout: fixed; width: 1144px">
      <colgroup>
        <col style="width: 147px">
        <col style="width: 832px">
        <col style="width: 165px">
      </colgroup>
      <tbody>
        <tr>
          <td class="tg-zv4m"></td>
          <td class="tg-b5gb"><br><br><br></td>
          <td class="tg-zv4m"></td>
        </tr>
        <tr>
          <td class="tg-zv4m"></td>
          <td class="tg-b5gb" style="font-size:1.5vw">Welcome ${to}!<br><br></td>
          <td class="tg-zv4m"></td>
        </tr>
        <tr>
          <td class="tg-0pky"></td>
          <td class="tg-bq5v" style="font-size:1vw">We received a request to reset your password on the ${organization} system. <br><br></td>
          <td class="tg-0pky"></td>
        </tr>
        <tr>
          <td class="tg-il3a"></td>
          <td class="tg-n3mx" style="font-size:1vw">Please click <a href="${link}">here</a> to reset your password (or copy and paste the link below).<br><br></td>
          <td class="tg-il3a"></td>
        </tr>
        <tr>
          <td class="tg-zv4m"></td>
          <td class="tg-b5gb" style="font-size:1vw">${link}<br><br></td>
          <td class="tg-zv4m"></td>
        </tr>
        <tr>
          <td class="tg-zv4m"></td>
          <td class="tg-b5gb" style="font-size:1vw">This link will expire in 10 minutes. <br><br></td>
          <td class="tg-zv4m"></td>
        </tr>
        <tr>
          <td class="tg-zv4m"></td>
          <td class="tg-b5gb" style="font-size:1vw">If you did not request this service, you can safely ignore this email and your password will remain the same. <br><br></td>
          <td class="tg-zv4m"></td>
        </tr>
        <tr>
          <td class="tg-0pky"></td>
          <td class="tg-bq5v" style="font-size:1vw">Thank you,<br></td>
          <td class="tg-0pky"></td>
        </tr>
        <tr>
          <td class="tg-0pky"></td>
          <td class="tg-bq5v" style="font-size:1.5vw;font-weight:bold">${organization}<br></td>
          <td class="tg-0pky"></td>
        </tr>
        <tr>
          <td class="tg-zv4m"></td>
          <td class="tg-b5gb"><br><br></td>
          <td class="tg-zv4m"></td>
        </tr>
      </tbody>
    </table>
  </div>`

  await NodeMailer.sendMail({
    from: from,
    to: to,
    subject: `${organization} Enterprise Agent Password Reset Request`,
    html: emailPasswordReset,
  })
}

// Perform Agent Business Logic

// Verify SMTP connection and return an error message witht the prompt to set up SMTP server.
async function smtpCheck() {
  // Accessing transporter
  const transporter = await NodeMailer.emailService()
  // Verifying SMTP configs
  return new Promise((resolve, reject) => {
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error)
        reject(false)
      } else {
        console.log('Server is ready to take our messages')
        resolve(success)
      }
    })
  })
}

export async function getUser(userID) {
  try {
    const user = await Users.readUser(userID)
    return user
  } catch (error) {
    console.error('Error Fetching User')
    throw error
  }
}
export async function getUserByToken(userToken) {
  try {
    const user = await Users.readUserByToken(userToken)
    return user
  } catch (error) {
    console.error('Error Fetching User by Token')
    throw error
  }
}

export async function getUserByEmail(userEmail) {
  try {
    const user = await Users.readUserByEmail(userEmail)
    return user
  } catch (error) {
    console.error('Error Fetching User by Email')
    throw error
  }
}

export async function getAll () {
  try {
    const users = await Users.readUsers()
    // Trim password and jwt
    for (let i = 0; i < users.length; i++) {
      delete users[i].password
      delete users[i].token
    }

    return users
  } catch (error) {
    console.error('Error Fetching Users')
    throw error
  }
}

export async function createUser (organization_id, email, first_name, last_name, roles) {
  // Resolving SMTP check promise
  try {
    await smtpCheck()
  } catch (error) {
    console.error(
      'USER ERROR: Cannot verify SMTP configurations. Error code: ',
      error,
    )
    return {
      error:
        "USER ERROR: The confirmation email can't be sent. Please, check your SMTP configurations.",
    }
  }

  // Empty/data checks
  if (!first_name || !last_name || !email || !Array.isArray(roles) || !roles.length)
    return {error: 'USER ERROR: All fields must be filled out.'}

  if (!Utils.validateEmail(email))
    return {error: 'USER ERROR: Must be a valid email.'}

  try {
    // Checking for duplicate email
    const duplicateUser = await Users.readUserByEmail(email)
    if (duplicateUser)
      return {error: 'USER ERROR: A user with this email already exists.'}

    const user = await Users.createUser(organization_id, email, first_name, last_name)

    for (let i = 0; i < roles.length; i++) {
      await Users.linkRoleAndUser(roles[i], user.user_id)
    }

    const token = jwt.sign({id: user.user_id}, process.env.JWT_SECRET, {
      expiresIn: '24h',
    })

    const user_id = user.user_id
    const password = ''

    const newUser = await Users.updateUserInfo(
      user_id,
      organization_id,
      email,
      first_name,
      last_name,
      password,
      token,
    )

    // Get email from SMTP config
    const currentSMTP = await SMTP.getSMTP()
    const currentOrganization = await SMTP.getOrganization()

    // Send new account email
    sendEmailNewAccount(
      currentSMTP.dataValues.value.auth.user,
      user.email,
      currentOrganization.value.companyName,
      token,
    )

    // Broadcast the message to all connections
    Websockets.sendMessageToAll('USERS', 'USER_CREATED', {user: [newUser]})

    // Return true to trigger the success message
    return true
  } catch (error) {
    console.error('Error Fetching User')
    throw error
  }
}

export async function updateUser (
  user_id,
  organization_id,
  email,
  first_name,
  last_name,
  password,
  token,
  roles,
  flag?,
) {
  try {
    // Checks for updating the user by admin
    if (!email) {
      console.log('ERROR: email is empty.')
      return {error: 'USER ERROR: All fields must be filled out.'}
    }

    if (roles) {
      if (!Array.isArray(roles) || !roles.length) {
        console.log('ERROR: All fields must be filled out.')
        return {error: 'USER ERROR: Roles are empty.'}
      }
    }

    if (!Utils.validateEmail(email)) {
      console.log('ERROR: Must be a valid email.')
      return {error: 'USER ERROR: Must be a valid email.'}
    }

    // Checking for duplicate email
    const duplicateEmail = await Users.readUserByEmail(email)
    if (duplicateEmail && duplicateEmail.user_id !== user_id) {
      return {error: 'USER ERROR: A user with this email already exists.'}
    }

    const userToUpdate = await Users.readUser(user_id)

    // Update user on user account setup
    if (password && userToUpdate.password !== password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      const emptyToken = ''
      await Users.updateUserInfo(
        user_id,
        organization_id,
        email,
        first_name,
        last_name,
        hashedPassword,
        emptyToken,
      )
    } else {
      // Update user on user password forgot password/admin user edit

      // Check if updating the user by adding the token from forgot-password component
      if (flag === 'password reset') {
        // Resolving SMTP check promise
        try {
          await smtpCheck()
        } catch (error) {
          console.error(
            'USER ERROR: Cannot verify SMTP configurations. Error code: ',
            error,
          )
          return {
            error:
              "USER ERROR: The password reset email can't be sent. Talk to your administrator.",
          }
        }

        const newToken = jwt.sign({id: user_id}, process.env.JWT_SECRET, {
          expiresIn: '10m',
        })

        await Users.updateUserInfo(user_id, organization_id, email, password, first_name, last_name, newToken)

        // Get email from SMTP config
        const currentSMTP = await SMTP.getSMTP()
        const currentOrganization = await SMTP.getOrganization()

        if (email) {
          sendEmailPasswordReset(
            currentSMTP.dataValues.value.auth.user,
            email,
            currentOrganization.value.companyName, // This is the ISSUING organization, not the user's organization
            newToken,
          )
        } else {
          // This user isn't set up yet, so resend the new account email
          sendEmailNewAccount(
            currentSMTP.dataValues.value.auth.user,
            email,
            currentOrganization.value.companyName,
            newToken,
          )
        }
      } else {
        // User update by admin
        await Users.updateUserInfo(user_id, organization_id, email, password, first_name, last_name, token)
      }
    }

    if (roles) {
      // If roles need to get updated (user edit by admin) clear old roles-user connections
      await Users.deleteRolesUserConnection(user_id)

      // Loop roles and create connections with the user
      for (let i = 0; i < roles.length; i++) {
        await Users.linkRoleAndUser(roles[i], user_id)
      }
    }

    const updatedUser = await Users.readUser(user_id)
    // Hack: update the password and send it back
    updatedUser.password = password

    // Broadcast the message to all connections
    Websockets.sendMessageToAll('USERS', 'USER_UPDATED', {updatedUser})

    console.log('Updated user')

    // Return updatedUser (truthy) to trigger a success message
    return updatedUser
  } catch (error) {
    console.error('Error Fetching User update')
    throw new Error("Error Fetching User update")
  }
}

export async function updatePassword (id, password) {
  try {
    const userToUpdate = await Users.readUser(id)

    if (userToUpdate.password !== password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      await Users.updateUserPassword(id, hashedPassword)
    } else {
      await Users.updateUserPassword(id, password)
    }
    const user = await Users.readUser(id)
    return user
  } catch (error) {
    console.error('Error Fetching Password update')
    throw error
  }
}

export async function deleteUser (userID) {
  try {
    const deletedUser = await Users.deleteUser(userID)

    // Broadcast the message to all connections
    Websockets.sendMessageToAll('USERS', 'USER_DELETED', deletedUser)

    // Return true to trigger a success message
    return true
  } catch (error) {
    console.error('Error Fetching User')
    throw error
  }
}

export async function resendAccountConfirmation (email) {
  // Resolving SMTP check promise
  try {
    await smtpCheck()
  } catch (error) {
    console.error(
      "USER ERROR: can't verify SMTP configurations. Error code: ",
      error,
    )
    return {
      error:
        "USER ERROR: The confirmation email can't be sent. Please, check your SMTP configurations.",
    }
  }

  try {
    const user = await Users.readUserByEmail(email)

    const token = jwt.sign({id: user.user_id}, process.env.JWT_SECRET, {
      expiresIn: '24h',
    })

    const password = ''

    const updatedUser = await Users.updateUserInfo(
      user.user_id,
      user.organization_id,
      email,
      password,
      user.first_name,
      user.last_name,
      token,
    )

    if (!updatedUser)
      return {
        error:
          "USER ERROR: The confirmation email can't be re-sent. Try again later.",
      }

    // Get email from SMTP config
    const currentSMTP = await SMTP.getSMTP()
    const currentOrganization = await SMTP.getOrganization()

    // Send new account email
    sendEmailNewAccount(
      currentSMTP.dataValues.value.auth.user,
      email,
      currentOrganization.value.companyName,
      token,
    )

    // Return true to trigger the success message
    return true
  } catch (error) {
    console.error('Error Fetching User')
    throw error
  }
}

// module.exports = {
//   createUser,
//   getUser,
//   getUserByToken,
//   getUserByEmail,
//   getAll,
//   updateUser,
//   updatePassword,
//   deleteUser,
//   resendAccountConfirmation,
// }
