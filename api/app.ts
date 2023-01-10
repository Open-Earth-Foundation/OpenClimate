require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const session = require('express-session')
import {Utils} from './util'
const expressWinston = require('express-winston')
import createError, {BadRequest, InternalServerError, NotFound} from 'http-errors'

import { ACCESS_TOKEN_SECRET } from "./auth/secret";
import { sign } from "jsonwebtoken";

// Envision imports
import schemaRoutes from './routes/schema.routes'
import pledgeRoutes from './routes/pledge.routes'
import transferRoutes from './routes/transfer.routes'
import siteRoutes from './routes/site.routes'
import walletRoutes from './routes/registered-wallets.routes'
import proofsRoutes from './routes/proofs.routes'
import trustedRegistryRoutes from './routes/trusted-registry.routes'
import climateActionRoutes from './routes/climate-action.routes'
import aggregatedEmissionRoutes from './routes/aggregated-emission.routes'
import cors from 'cors'
import geodataRoutes from './routes/geodata.routes';

// Emissions imports
import countryRoutes from './routes/country.routes';
import subnationalRoutes from './routes/subnationals.routes';
import cityRoutes from './routes/cities.routes';
import providerRoutes from './routes/providers.routes'
import actorRoutes from './routes/actor.routes'
import searchRoutes from './routes/search.routes'

const Connections = require('./orm/connections.ts')
const Users = require('./agentLogic/users')
const Organizations = require('./agentLogic/organizations')

const Images = require('./agentLogic/images')

require('./passport-config')(passport)

// We use one Winston instance for the entire app

const logger = require('./logger').child({module: __filename})

export const app = express()

app.use((req, res, next) => {
  req.logger = logger
  next()
})

app.use(expressWinston.logger({
  winstonInstance: logger,
  expressFormat: true,
  colorize: true
}))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(passport.initialize())

const agentWebhookRouter = require('./agentWebhook')
// Add cors
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // enable pre-flight

app.use(express.json())
app.use(schemaRoutes)
app.use(pledgeRoutes)
app.use(transferRoutes)
app.use(siteRoutes)
app.use(climateActionRoutes)
app.use(aggregatedEmissionRoutes)
app.use(geodataRoutes)

app.use(countryRoutes);
app.use(subnationalRoutes);
app.use(cityRoutes);
app.use(providerRoutes)


app.use(walletRoutes)
app.use(proofsRoutes)
app.use(trustedRegistryRoutes)
app.use(actorRoutes)
app.use(searchRoutes)

// recommended wrapper for Express async handlers
// see https://expressjs.com/en/advanced/best-practice-performance.html#use-promises

const wrap = fn => (...args) => fn(...args).catch(args[2])

// Send all cloud agent webhooks posting to the agent webhook router
app.use('/api/controller-webhook', agentWebhookRouter)

// Present only in development to catch the secondary agent webhooks for ease of development
app.use('/api/second-controller', (req, res) => {
  req.logger.debug('Second ACA-Py Agent Webhook Message')
  res.status(200).send()
})

app.use(
  '/api/governance-framework',
  express.static('governance-framework.json'),
)

app.use(
  session({
    secret: process.env.SESSION_SECRET || "FAKESECRET123",
    cookie: {maxAge: 3600 * 1000, httpOnly: false},
    name: 'sessionId',
    resave: true, // Forces the session to be saved back to the session store, even if the session was never modified during the request.
    rolling: true, // keep updating the session on new requests
    saveUninitialized: false, // don't create a session on any API call where the session is not modified
    secure: true, // only use cookie over https
    ephemeral: false, // delete this cookie while browser close
  }),
)

app.use(passport.session())

// Authentication
app.post('/api/user/log-in', wrap(async (req, res, next) => {
  // Empty/data checks
  if (!req.body.email || !req.body.password)
    throw new BadRequest('All fields must be filled out.')

  if (!Utils.validateEmail(req.body.email))
    throw new BadRequest('Incorrect email and/or password')

  if (!Utils.validatePassword(req.body.password))
    throw new BadRequest('Incorrect email and/or password')

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      next(err)
      return
    } else if (!user) {
      next(new BadRequest('Incorrect email and/or password'))
    } else {
      req.logIn(user, async (err) => {
        if (err) {
          next(err)
          return
        }

        // Put roles in the array
        const userRoles = []
        req.user.Roles.forEach((element) => userRoles.push(element.role_name))

        const connection = await Connections.readConnectionByUserId(req.user.user_id)
        let connection_id = ''

        if (connection && connection.connection_id)
          connection_id = connection.connection_id

        // Save cookie

        res.cookie(
          'user',
          {
            id: req.user.user_id,
            connection_id: connection_id,
            email: req.user.email,
            roles: userRoles,
          },
          {
            sameSite: 'None',
            secure: true,
            httpOnly: false
          },
        )

        const user = await Users.getUserByEmail(req.user.email)
        let company = await Organizations.getOrganization(user.organization_id)
        if (user && user.dataValues && user.dataValues.Organization && user.dataValues.Organization.dataValues) {
          company = user.dataValues.Organization.dataValues
        }

        req.session.save()

        res.json({
          id: req.user.user_id,
          email: req.user.email,
          roles: userRoles,
          company: company,
          session: req.session
        })
      })
    }
  })(req, res, next)
}))

// Passwordless Authentication
app.post('/api/user/passwordless-log-in', wrap(async (req, res) => {
  try {
    if (req.body) {
      const userByEmail = await Users.getUserByEmail(req.body.email)

      if (!userByEmail || userByEmail === undefined) {
        throw new BadRequest('The user was not found.')
      } else {
        // Put roles in the array
        const userRoles = []
        userByEmail.Roles.forEach((element) => userRoles.push(element.role_name))

        const connection = await Connections.readConnectionByUserId(userByEmail.user_id)
        let connection_id = ''

        if (connection && connection.connection_id)
          connection_id = connection.connection_id

        res.cookie(
          'user',
          {
            id: userByEmail.user_id,
            connection_id: connection_id,
            email: userByEmail.email,
            roles: userRoles
          },
          {
            sameSite: 'None',
            secure: true,
            httpOnly: false
          },
        )

        let company = await Organizations.getOrganization(userByEmail.organization_id)
        if (userByEmail && userByEmail.dataValues && userByEmail.dataValues.Organization && userByEmail.dataValues.Organization.dataValues) company = userByEmail.dataValues.Organization.dataValues

        // I don't know if we need line 157 and 158. Didn't have a chance to test
        req.session
        req.session.save()

        res.json({
          id: userByEmail.user_id,
          email: userByEmail.email,
          roles: userRoles,
          company: company,
          session: req.session,
        })
      }
    }
  } catch (error) {
    req.logger.error(error)
    throw new InternalServerError('There was an error.')
  }
}))

// Logging out
app.post('/api/user/log-out', wrap(async (req, res) => {
  req.logout()
  req.session.destroy(function (err) {
    if (!err) {
      res
        .status(200)
        .clearCookie('sessionId', {path: '/'})
        .clearCookie('user', {path: '/'})
        .json({status: 'Session destroyed.'})
    } else {
      res.send("Couldn't destroy the session.")
    }
  })
}))

// Validate JWT
app.post('/api/user/token/validate', wrap(async (req, res) => {
  try {
    const verify = jwt.verify(req.body.token, process.env.JWT_SECRET)
    req.logger.debug(verify)
    res.status(200).json({status: 'The link is valid.'})
  } catch (err) {
    req.logger.error(err)
    throw new BadRequest('The link has expired.')
  }
}))

app.post('/api/user/password/update', wrap(async (req, res) => {
  try {
    jwt.verify(req.body.token, process.env.JWT_SECRET)
    req.logger.debug('The token is valid.')
  } catch (err) {
    logger.error({name: err.name, message: err.message})
    logger.debug('The token has expired.')
    throw new BadRequest('The link has expired.')
  }

  let user = undefined

  if (!req.body.password)
    res.status(200).json({error: 'All fields must be filled out.'})
  else if (!Utils.validatePassword(req.body.password)) {
    res.json({
      error:
        'Passwords must contain at least 1 digit, 1 lowercase and 1 uppercase letter, 1 special character, and 8 or more characters.',
    })
  } else {
    try {
      const validToken = await Users.getUserByToken(req.body.token)
      if (validToken.user_id !== req.body.id)
        throw new BadRequest('The token did not match the user.')
    } catch (error) {
      throw error
    }

    user = await Users.updatePassword(req.body.id, req.body.password)
    if (!user)
      res.status(200).json({error: "The password couldn't be updated."})
    else res.status(200).json({status: 'Password updated.'})
  }
}))

app.post('/api/user/update', wrap(async (req, res) => {
  let userByToken = undefined
  let user = undefined
  if (req.body.flag && req.body.flag === 'set-up user') {
    // Updating the user during the user setup process

    // Check for the valid token
    try {
      const verify = jwt.verify(req.body.token, process.env.JWT_SECRET)
      req.logger.debug('The token is valid.')
    } catch (error) {
      throw new BadRequest('The link has expired.')
    }

    if (!Utils.validatePassword(req.body.password)) {
      throw new BadRequest('Passwords must contain at least 1 digit, 1 lowercase and 1 uppercase letter, 1 special character, and 8 or more characters.')
    }

    userByToken = await Users.getUserByToken(req.body.token)

    if (!userByToken) {
      throw new BadRequest('The user was not found.')
    }

    user = await Users.updateUser(
      userByToken.user_id,
      userByToken.organization_id,
      userByToken.email,
      userByToken.first_name,
      userByToken.last_name,
      req.body.password,
      req.body.token,
      null,
      req.body.flag,
    )
  } else {
    // Updating the token for the user (from password forgot screen)

    // Empty/data checks
    if (!req.body.email) {
      throw new BadRequest('All fields must be filled out.')
    }

    if (!Utils.validateEmail(req.body.email)) {
      throw new BadRequest('Must be a valid email.')
    }

    let userByEmail = await Users.getUserByEmail(req.body.email)

    if (!userByEmail) {
      throw new BadRequest('The user was not found.')
    }

    user = await Users.updateUser(
      userByEmail.user_id,
      userByEmail.organization_id,
      userByEmail.email,
      userByEmail.password,
      userByEmail.first_name,
      userByEmail.last_name,
      null,
      null,
      req.body.flag,
    )
  }

  // If SMTP is not set up or broken
  if (user.error) {
    res.send(user.error)
  }

  if (!user) {
    throw new BadRequest("The user couldn't be updated.")
  } else {
    // Authenticate this user and send user data to client

    // connect user by email
    const connection = await Connections.readConnectionByUserId(user.dataValues.email)
    let connection_id = ''

    // Push roles into array
    const userRoles = [];
    user.dataValues.Roles.forEach((el)=>userRoles.push(el.role_name))

    if(connection && connection.connection_id)
      connection_id = connection.connection_id

    res.cookie(
      'user',
      {
        id: user.dataValues.user_id,
        connection_id: connection_id,
        email: user.dataValues.email,
        roles: userRoles,
      },
      {
        sameSite: 'None',
        secure: true,
        httpOnly: false
      }
    );

    // Get users designated company
    let company = await Organizations.getOrganization(user.Organization.organization_id)
    if(user && user.dataValues && user.dataValues.Organization && user.dataValues.Organization.dataValues) company = user.dataValues.Organization.dataValues

    req.session
    req.session.save()

    res.status(200).json({
      status: 'User updated.',
      user: user,
      id: user.dataValues.user_id,
      email: user.dataValues.email,
      roles: userRoles,
      company: company,
      session: req.session,
    })
  }
}))

// Logo retrieval
app.get('/api/logo', wrap(async (req, res) => {
  try {
    const logo = await Images.getImagesByType('logo')
    if (!logo) throw new NotFound('The logo was not found.')
    req.logger.debug(logo)
    res.send(logo)
  } catch (err) {
    req.logger.error(err)
  }
}))

// Session expiration reset
app.get('/api/session', wrap(async (req, res) => {
  res.status(200).json({status: 'session'})
}))

app.use('/', wrap(async (req, res) => {
  req.logger.debug('Request outside of normal paths', req.url)
  req.logger.debug(req.body)
  res.status(404).send()
}))

app.use(expressWinston.errorLogger({
  winstonInstance: logger
}))

// Default error handler

app.use((err, req, res, next) => {
  if ("status" in err) {
    res.status(err.status).json({success: false, message: err.message})
  } else if (process.env.NODE_ENV == "production") {
    res.status(500).json({success: false, message: 'A server error occurred'})
  } else {
    res.status(500).json({success: false, name: err.name, message: err.message, trace: err.trace})
  }
})