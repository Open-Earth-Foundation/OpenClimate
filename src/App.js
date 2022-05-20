import Axios from 'axios'

import Cookies from 'universal-cookie'

import React, { FunctionComponent, useState, useEffect, useRef } from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'

import AccountSetup from './UI/AccountSetup'
import AppHeader from './UI/AppHeader'

import { check, CanUser } from './UI/CanUser'
import rules from './UI/rbac-rules'

// Envision imports
//import MainLayout from './layouts/main-layout/main.layout'
import LoginCredential from './shared/components/modals/login-credential/login-credential.modal';
import LoginModal from './shared/components/modals/login/login.modal';
import RegistrationModal from './shared/components/modals/registration/registration.modal';
import MainToolbar from './shared/components/toolbar/toolbar';
import './layouts/main-layout/main.layout.scss';

// Envision imports
import ReviewPage from  './components/review/review.page';
import { DispatchThunk, RootState } from './store/root-state';
import { doLogin, loginSuccess, doLogout, doPaswordlessLoginSucess } from './store/user/user.actions';
import { connect } from 'react-redux'
import AccountPage from './components/account/account.page';
import RegisterWalletPage from './UI/RegisterWallet';
import VerifyInformationModal from './shared/components/modals/verify-information/verify-information.modal';
import * as userSelectors from './store/user/user.selectors';
import * as appSelectors from './store/app/app.selectors';
import { showModal } from './store/app/app.actions';
import Modal from './shared/components/modals/modal/modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IUser } from './api/models/User/IUser';
import IWallet from './api/models/DTO/Wallet/IWallet';
import { userService } from './shared/services/user.service';

import Account from './UI/Account'
import Contact from './UI/Contact'
import Contacts from './UI/Contacts'
import Credential from './UI/Credential'
import Credentials from './UI/Credentials'
import ForgotPassword from './UI/ForgotPassword'
import FullPageSpinner from './UI/FullPageSpinner'
import Home from './UI/Home'
import Login from './UI/Login'
import {
  useNotification,
  NotificationProvider,
} from './UI/NotificationProvider'
import Organizations from './UI/Organizations'
import PasswordReset from './UI/PasswordReset'
import Settings from './UI/Settings'
import User from './UI/User'
import Users from './UI/Users'

import SessionProvider from './UI/SessionProvider'

import './App.css'
import { loadWallets } from './store/account/account.actions'
import * as accountActions from './store/account/account.actions';
import * as accountSelectors from './store/account/account.selectors';

const Frame = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`
const Main = styled.main`
  flex: 9;
  padding: ${(props) => props?.hasBackgroundColor ? '0px' : '30px' ?? '30px' };
`

// Envision Interface
interface Props {
  currentUser: IUser | null,
  loading: boolean,
  doLoginClick: (email: string, password: string) => void,
  doLoginSuccess: (user: IUser | null) => void,
  showModal: (type: string) => void,
  doLogout: () => void,
  wallets: Array<IWallet>,
  walletsLoaded: boolean,
  loadWallets: (orgId: string) => void,
}

export interface Theme {
  primary_color: string,
  secondary_color: string,
  neutral_color: string,
  negative_color: string,
  warning_color: string,
  positive_color: string,
  text_color: string,
  text_light: string,
  border: string,
  drop_shadow: string,
  background_primary: string,
  background_secondary: string,
}

const App: FunctionComponent<Props> = (props) => {
  // Envision props
  const { currentUser, loading, doLoginClick, doLoginSuccess, showModal, doLogout, wallets, walletsLoaded, loadWallets } = props;

  const defaultTheme = {
    primary_color: '#5191CE',
    secondary_color: '#1B3F62',
    neutral_color: '#091C40',
    negative_color: '#ed003c',
    warning_color: '#e49b13',
    positive_color: '#008a00',
    text_color: '#555',
    text_light: '#fff',
    border: '#e3e3e3',
    drop_shadow: '3px 3px 3px rgba(0, 0, 0, 0.3)',
    background_primary: '#fff',
    background_secondary: '#f5f5f5',
  }

  const cookies = new Cookies()

  // Keep track of loading processes
  let loadingArray = []

  const setNotification = useNotification()

  // Websocket reference hook
  const controllerSocket = useRef()
  const controllerAnonSocket = useRef()

  // Used for websocket auto reconnect
  const [websocket, setWebsocket] = useState(false)
  const [anonwebsocket, setAnonWebsocket] = useState(false)

  // State governs whether the app should be loaded. Depends on the loadingArray
  const [appIsLoaded, setAppIsLoaded] = useState(false)

  // Check for local state copy of theme, otherwise use default hard coded here in App.js
  const localTheme = JSON.parse(localStorage.getItem('recentTheme'))
  const [theme, setTheme] = useState(localTheme ? localTheme : defaultTheme)
  const [schemas, setSchemas] = useState({})

  // Styles to change array
  const [stylesArray, setStylesArray] = useState([])

  // Message states
  const [contacts, setContacts] = useState([])
  const [credentials, setCredentials] = useState([])
  const [image, setImage] = useState()
  const [roles, setRoles] = useState([])
  const [users, setUsers] = useState([])
  const [user, setUser] = useState({})
  const [organizations, setOrganizations] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [organizationName, setOrganizationName] = useState(null)

  // Session states
  const [session, setSession] = useState('')
  const [loggedInUserId, setLoggedInUserId] = useState('')
  const [loggedInUserState, setLoggedInUserState] = useState(null)
  const [loggedInEmail, setLoggedInEmail] = useState('')
  const [loggedInRoles, setLoggedInRoles] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)
  const [sessionTimer, setSessionTimer] = useState(60)

  const [QRCodeURL, setQRCodeURL] = useState('')
  const [focusedConnectionID, setFocusedConnectionID] = useState('')
  const [emailStatus, setEmailStatus] = useState()
  const [organizationStatus, setOrganizationStatus] = useState()
  const [verificationStatus, setVerificationStatus] = useState()
  const [verifiedCredential, setVerifiedCredential] = useState('')
  const [accountCredentialIssued, setAccountCredentialIssued] = useState(false)
  const [scope1, setScope1] = useState()
  const [wallet, setWallet] = useState()
  const toastError = (msg)=> {
    toast.error(
      msg,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        }
    )
  }
  const toastSuccess = (msg)=> {
    toast.success(
      msg,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        }
    )
  }

  const toastInfo = (msg)=> {
    toast.info(
      msg,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        }
    )
  } 
  // (JamesKEbert) Note: We may want to abstract the websockets out into a high-order component for better abstraction, especially potentially with authentication/authorization

  // Perform First Time Setup. Connect to Controller Server via Websockets

  // Always configure the anon websocket
  if (!anonwebsocket) {
    console.log("Controller address ", process.env.REACT_APP_CONTROLLER)
    let url = new URL('/api/anon/ws', process.env.REACT_APP_CONTROLLER)
    url.protocol = url.protocol.replace('http', 'ws')
    controllerAnonSocket.current = new WebSocket(url.href)
    setAnonWebsocket(true)

    controllerAnonSocket.current.onclose = (event) => {
      // Auto Reopen websocket connection
      // (JamesKEbert) TODO: Converse on sessions, session timeout and associated UI

      setLoggedIn(false)
      setAnonWebsocket(!anonwebsocket)
    }

    // Error Handler
    controllerAnonSocket.current.onerror = (event) => {
      setNotification('Client Error - Websockets', 'error')
    }

    // Receive new message from Controller Server
    controllerAnonSocket.current.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data)

      messageHandler(
        parsedMessage.context,
        parsedMessage.type,
        parsedMessage.data
      )
    }
  }

  // Setting up websocket and controllerSocket
  useEffect(() => {
    if (session && loggedIn && websocket) {
      console.log("Set websocket")
      let url = new URL('/api/admin/ws', process.env.REACT_APP_CONTROLLER)
      url.protocol = url.protocol.replace('http', 'ws')
      controllerSocket.current = new WebSocket(url.href)
      setWebsocket(true)
    }
  }, [loggedIn, session, websocket])

  // TODO: Setting logged-in user and session states on app mount
  useEffect(() => {
    Axios({
      method: 'GET',
      url: `${process.env.REACT_APP_CONTROLLER}/api/session`,
    }).then((res) => {
      console.log("/api/session response", res)
      if (res.status) {
        // Check for a session and then set up the session state based on what we found
        setSession(cookies.get('sessionId'))

        if (cookies.get('sessionId')) {
          setLoggedIn(true)
          setWebsocket(true)

          if (cookies.get('user')) {
            const userCookie = cookies.get('user')
            console.log("User from cookies", userCookie)
            setLoggedInUserState(userCookie)
            setLoggedInUserId(userCookie.id)
            setLoggedInEmail(userCookie.email)
            setLoggedInRoles(userCookie.roles)
            if(!walletsLoaded)
              loadWallets(userCookie.id);
          } else setAppIsLoaded(true)
        } else setAppIsLoaded(true)
      }
    })
  }, [loggedIn])

  useEffect(() => {
    if (emailStatus && organizationStatus) {
      setVerifiedCredential(emailStatus)
      setVerificationStatus(true)
      handlePasswordlessLogin(emailStatus)
    }
  }, [emailStatus, organizationStatus])

  const handlePasswordlessLogin = (email) => {
    Axios({
      method: 'POST',
      data: {
        email: email
      },
      url: `${process.env.REACT_APP_CONTROLLER}/api/user/passwordless-log-in`,
    }).then(async (res) => {
      if (res.data.error) {
        // setNotification isn't defined everywhere we need to use it, so we can't display the error this way
        // setNotification(res.data.error, 'error')
        // We don't want to redirect to the home page in every case, we shouldn't do this, either.
        // history.push('/')
      } else {
        // Setting a session cookie this way doesn't seem to be the best way
        cookies.set('sessionId', res.data.session, { path: '/', expires: res.data.session.expires, httpOnly: res.data.session.httpOnly, originalMaxAge: res.data.session.originalMaxAge })
        cookies.set('user', res.data);
        // console.log("Setting up the user now")
        setLoggedIn(true)
        setUpUser(res.data.id, res.data.email, res.data.roles)

        // Envision login
        // const envisionUser = await userService.getUserByEmail(res.data.email)
        doLoginSuccess(res.data)
        localStorage.setItem('user', JSON.stringify(res.data));
      }
    })
  }

  const handlePasswordLogin = (email, userPassword, setNotification) => {
    Axios({
      method: 'POST',
      data: {
        email: email,
        password: userPassword
      },
      url: `${process.env.REACT_APP_CONTROLLER}/api/user/log-in`,
    }).then(async (res) => {
      console.log("Response ", res)
      if (res.data.error) {
        // setNotification isn't defined everywhere we need to use it, so we can't display the error this way
        setNotification(res.data.error, 'error')
        // We don't want to redirect to the home page in every case, we shouldn't do this, either.
        // history.push('/')
      } else {
        // Setting a session cookie this way doesn't seem to be the best way
        cookies.set('sessionId', res.data.session, { path: '/', expires: res.data.session.expires, httpOnly: res.data.session.httpOnly, originalMaxAge: res.data.session.originalMaxAge })
        cookies.set('user', res.data);
        // console.log("Setting up the user now")
        setLoggedIn(true)
        setUpUser(res.data.id, res.data.email, res.data.roles)

        // Envision login
        // const envisionUser = await userService.getUserByEmail(res.data.email)
        doLoginSuccess(res.data)
        localStorage.setItem('user', JSON.stringify(res.data));
      }
    })
  }

  // Define Websocket event listeners
  useEffect(() => {
    // Perform operation on websocket open
    // Run web sockets only if authenticated
    if (session && loggedIn && websocket) {
      console.log("Set websocket")
      controllerSocket.current.onopen = () => {
        // Resetting state to false to allow spinner while waiting for messages
        setAppIsLoaded(false) // This doesn't work as expected. See function removeLoadingProcess

        // Wait for the roles for come back to start sending messages
        console.log('Ready to send messages')

        sendMessage('SETTINGS', 'GET_THEME', {})
        addLoadingProcess('THEME')
        sendMessage('SETTINGS', 'GET_SCHEMAS', {})
        addLoadingProcess('SCHEMAS')

        if (
          check(rules, loggedInUserState, 'contacts:read', 'demographics:read')
        ) {
          sendMessage('CONTACTS', 'GET_ALL', {
            additional_tables: ['Demographic', 'Passport'],
          })
          addLoadingProcess('CONTACTS')
        }

        if (check(rules, loggedInUserState, 'credentials:read')) {
          sendMessage('CREDENTIALS', 'GET_ALL', {})
          addLoadingProcess('CREDENTIALS')
        }

        if (check(rules, loggedInUserState, 'roles:read')) {
          sendMessage('ROLES', 'GET_ALL', {})
          addLoadingProcess('ROLES')
        }

        sendMessage('SETTINGS', 'GET_ORGANIZATION_NAME', {})
        addLoadingProcess('ORGANIZATION')

        sendMessage('IMAGES', 'GET_ALL', {})
        addLoadingProcess('LOGO')

        if (check(rules, loggedInUserState, 'users:read')) {
          sendMessage('USERS', 'GET_ALL', {})
          addLoadingProcess('USERS')
        }

        if (check(rules, loggedInUserState, 'organizations:read')) {
          sendMessage('ORGANIZATIONS', 'GET_ALL', {})
          addLoadingProcess('ORGANIZATIONS')
        }
      }

      controllerSocket.current.onclose = (event) => {
        // Auto Reopen websocket connection
        // (JamesKEbert) TODO: Converse on sessions, session timeout and associated UI

        setLoggedIn(false)
        setWebsocket(!websocket)
      }

      // Error Handler
      controllerSocket.current.onerror = (event) => {
        setNotification('Client Error - Websockets', 'error')
      }

      // Receive new message from Controller Server
      controllerSocket.current.onmessage = (message) => {
        const parsedMessage = JSON.parse(message.data)

        messageHandler(
          parsedMessage.context,
          parsedMessage.type,
          parsedMessage.data
        )
      }
    }
  }, [session, loggedIn, users, user, websocket, image, loggedInUserState]) // (Simon) We have to listen to all 7 to for the app to function properly

  // Send a message to the Controller server
  function sendAnonMessage(context, type, data = {}) {
    if (
      controllerAnonSocket.current.readyState !==
      controllerAnonSocket.current.OPEN
    ) {
      setTimeout(function () {
        sendAnonMessage(context, type, data)
      }, 100)
    } else {
      controllerAnonSocket.current.send(JSON.stringify({ context, type, data }))
    }
  }

  // Send a message to the Controller server
  function sendMessage(context, type, data = {}) {
    if (controllerSocket.current.readyState !== controllerSocket.current.OPEN) {
      setTimeout(function () {
        sendMessage(context, type, data)
      }, 100)
    } else {
      console.log("Sending ws request")
      controllerSocket.current.send(JSON.stringify({ context, type, data }))
    }
  }

  // Handle inbound messages
  async function messageHandler (context, type, data = {}, setNotification) {
    try {
      console.log(
        `New Message with context: '${context}' and type: '${type}' with data:`,
        data
      )
      switch (context) {
        case 'ERROR':
          switch (type) {
            case 'SERVER_ERROR':
              // setNotification(
              //   `Server Error - ${data.errorCode} \n Reason: '${data.errorReason}'`,
              //   'error'
              // )
              toastError(`Server Error - ${data.errorCode} \n Reason: '${data.errorReason}'`)
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'INVITATIONS':
          switch (type) {
            case 'INVITATION':
              console.log("QR", data.invitation_record.invitation_url)
              let decoded_qr = Buffer.from(data.invitation_record.invitation_url.split('=')[1], 'base64').toString()
              console.log("Decoded QR", decoded_qr)
              setQRCodeURL(data.invitation_record.invitation_url)
              break

            case 'INVITATIONS_ERROR':
              console.log(data.error)
              console.log('Invitations Error')
              toastError(data.error)
              break

            default:
              toastError(
                `Error - Unrecognized Websocket Message Type: ${type}`
              )
              break
          }
          break

        case 'CONTACTS':
          switch (type) {
            case 'CONTACTS':
              let updatedContacts = data.contacts

              // (mikekebert) Sort the array by data created, newest on top
              updatedContacts.sort((a, b) =>
                a.created_at < b.created_at ? 1 : -1
              )

              setContacts(updatedContacts)
              removeLoadingProcess('CONTACTS')
              break

            case 'CONTACTS_ERROR':
              console.log(data.error)
              console.log('Contacts Error')
              setErrorMessage(data.error)
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'DEMOGRAPHICS':
          switch (type) {
            case 'DEMOGRAPHICS_ERROR':
              console.log(data.error)
              console.log('DEMOGRAPHICS ERROR')
              setErrorMessage(data.error)
              break

            case 'CONTACTS_ERROR':
              console.log(data.error)
              console.log('CONTACTS ERROR')
              setErrorMessage(data.error)
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'ROLES':
          switch (type) {
            case 'ROLES':
              let oldRoles = roles
              let newRoles = data.roles
              let updatedRoles = []
              // (mikekebert) Loop through the new roles and check them against the existing array
              newRoles.forEach((newRole) => {
                oldRoles.forEach((oldRole, index) => {
                  if (
                    oldRole !== null &&
                    newRole !== null &&
                    oldRole.role_id === newRole.role_id
                  ) {
                    // (mikekebert) If you find a match, delete the old copy from the old array
                    oldRoles.splice(index, 1)
                  }
                })
                updatedRoles.push(newRole)
              })
              // (mikekebert) When you reach the end of the list of new roles, simply add any remaining old roles to the new array
              if (oldRoles.length > 0)
                updatedRoles = [...updatedRoles, ...oldRoles]

              setRoles(updatedRoles)
              removeLoadingProcess('ROLES')
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'USERS':
          switch (type) {
            case 'USERS':
              let oldUsers = users
              let newUsers = data.users
              let updatedUsers = []
              // (mikekebert) Loop through the new users and check them against the existing array
              newUsers.forEach((newUser) => {
                oldUsers.forEach((oldUser, index) => {
                  if (
                    oldUser !== null &&
                    newUser !== null &&
                    oldUser.user_id === newUser.user_id
                  ) {
                    // (mikekebert) If you find a match, delete the old copy from the old array
                    oldUsers.splice(index, 1)
                  }
                })
                updatedUsers.push(newUser)
              })
              // (mikekebert) When you reach the end of the list of new users, simply add any remaining old users to the new array
              if (oldUsers.length > 0)
                updatedUsers = [...updatedUsers, ...oldUsers]
              // (mikekebert) Sort the array by data created, newest on top
              updatedUsers.sort((a, b) =>
                a.created_at < b.created_at ? 1 : -1
              )

              setUsers(updatedUsers)
              removeLoadingProcess('USERS')
              break

            case 'USER':
              let user = data.user[0]
              setUser(user)
              break

            case 'USER_UPDATED':
              setUsers(
                users.map((x) =>
                  x.user_id === data.updatedUser.user_id ? data.updatedUser : x
                )
              )
              setUser(data.updatedUser)
              break

            case 'PASSWORD_UPDATED':
              // (Simon) Replace the user with the updated user based on password)
              console.log('PASSWORD UPDATED')
              setUsers(
                users.map((x) =>
                  x.user_id === data.updatedUserPassword.user_id
                    ? data.updatedUserPassword
                    : x
                )
              )
              break

            case 'USER_CREATED':
              let newUser = data.user[0]
              let oldUsers2 = users
              oldUsers2.push(newUser)
              setUsers(oldUsers2)
              break

            case 'USER_DELETED':
              console.log('USER DELETED')
              const index = users.findIndex((v) => v.user_id === data)
              let alteredUsers = [...users]
              alteredUsers.splice(index, 1)
              setUsers(alteredUsers)
              break

            case 'USER_ERROR':
              console.log('USER ERROR', data.error)
              setErrorMessage(data.error)
              break

            case 'USER_SUCCESS':
              console.log('USER SUCCESS')
              setSuccessMessage(data)
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'CREDENTIALS':
          switch (type) {
            case 'CREDENTIALS':
              let oldCredentials = credentials
              let newCredentials = data.credential_records
              let updatedCredentials = []
              // (mikekebert) Loop through the new credentials and check them against the existing array
              newCredentials.forEach((newCredential) => {
                oldCredentials.forEach((oldCredential, index) => {
                  if (
                    oldCredential !== null &&
                    newCredential !== null &&
                    oldCredential.credential_exchange_id ===
                      newCredential.credential_exchange_id
                  ) {
                    // (mikekebert) If you find a match, delete the old copy from the old array
                    oldCredentials.splice(index, 1)
                  }
                })
                updatedCredentials.push(newCredential)
                // (mikekebert) We also want to make sure to reset any pending connection IDs so the modal windows don't pop up automatically
                if (newCredential.connection_id === focusedConnectionID) {
                  setFocusedConnectionID('')
                }
              })
              // (mikekebert) When you reach the end of the list of new credentials, simply add any remaining old credentials to the new array
              if (oldCredentials.length > 0)
                updatedCredentials = [...updatedCredentials, ...oldCredentials]
              // (mikekebert) Sort the array by data created, newest on top
              updatedCredentials.sort((a, b) =>
                a.created_at < b.created_at ? 1 : -1
              )

              setCredentials(updatedCredentials)
              removeLoadingProcess('CREDENTIALS')
              break

            case 'ACCOUNT_CREDENTIAL_ISSUED':
              setQRCodeURL('')
              setAccountCredentialIssued(true)

              break

            case 'CREDENTIALS_ERROR':
              console.log('Credentials Error:', data.error)

              setErrorMessage(data.error)
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'PRESENTATIONS':
          switch (type) {
            case 'VERIFIED':
              if (data.address && data.address.raw)
              {
                setEmailStatus(data.address.raw)
              }
              if (data.organization_name && data.organization_name.raw) {
                setOrganizationStatus(data.organization_name.raw)
              }
              break

            case 'VERIFICATION_FAILED':
                setVerifiedCredential('')
                setVerificationStatus(false)
                toastError(
                  `Verification failed ${data.error}`
                )
                break
            default:
              toastError(
                `Error - Unrecognized Websocket Message Type: ${type}`
              )
              break
          }
          break
        case 'EMISSION_PRESENTATION':
          switch (type) {
            case 'PRESENTATION_FAILED':
                toastError(
                  `Verification failed ${data.error}`
                )
                break
            default:
              toastError(
                `Error - Unrecognized Websocket Message Type: ${type}`
              )
              break
          }
          break

        case 'SETTINGS':
          switch (type) {
            case 'SETTINGS_THEME':
              // Writing the recent theme to a local storage
              const stringMessageTheme = JSON.stringify(data.value)
              window.localStorage.setItem('recentTheme', stringMessageTheme)
              setTheme(data.value)
              removeLoadingProcess('THEME')
              break

            case 'SETTINGS_SCHEMAS':
              setSchemas(data)
              removeLoadingProcess('SCHEMAS')
              break;

            case 'LOGO':
              setImage(data)
              removeLoadingProcess('LOGO')
              break

            case 'SETTINGS_ORGANIZATION':
              setOrganizationName(data.companyName)
              removeLoadingProcess('ORGANIZATION')
              break

            case 'SETTINGS_ERROR':
              console.log('Settings Error:', data.error)

              setErrorMessage(data.error)
              break

            case 'SETTINGS_SUCCESS':
              setSuccessMessage(data)
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'IMAGES':
          switch (type) {
            case 'IMAGE_LIST':
              setImage(data)

              removeLoadingProcess('IMAGES')
              break

            case 'IMAGES_ERROR':
              console.log('Images Error:', data.error)
              setErrorMessage(data.error)
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'ORGANIZATIONS':
          switch (type) {
            case 'ORGANIZATIONS':
              let updatedOrganizations = data.organizations
              // (mikekebert) Sort the array by data created, newest on top
              if (updatedOrganizations) {
                updatedOrganizations.sort((a, b) =>
                  a.created_at < b.created_at ? 1 : -1
                )
              }

              setOrganizations(updatedOrganizations)
              removeLoadingProcess('ORGANIZATIONS')
              break

            // Need a strategy for updating users who had this organization...
            // So we're waiting to handle this scenario later
            // case 'ORGANIZATION_DELETED':
            //   console.log('ORGANIZATION DELETED')
            //   const index = organizations.findIndex((v) => v.organization_id === data)
            //   let alteredOrganizations = [...organizations]
            //   alteredOrganizations.splice(index, 1)
            //   setOrganizations(alteredOrganizations)
            //   break

            case 'ORGANIZATION_ERROR':
              console.log('ORGANIZATION ERROR', data.error)
              setErrorMessage(data.error)
              break

            case 'ORGANIZATION_SUCCESS':
              console.log('ORGANIZATION SUCCESS')
              setSuccessMessage(data)
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break
        case 'EMISSIONS':
            switch (type) {
              case 'RECEIVED':
                if (data.facility_emissions_scope1_co2e)
                {
                  console.log('Recieved facility_emissions_scope1_co2e verified report',data.facility_emissions_scope1_co2e)
                  setScope1(data.facility_emissions_scope1_co2e)
                }
                
                break
              case 'CRED_DEF_EXIST':
                toastError(data.error)                
                break
  
              default:
                toastError(`Error - Unrecognized Websocket Message Type: ${type}`)
                break
            }
            break
        case 'WALLET':
            switch (type) {
              case 'ACCEPTED':
                if (data.wallet)
                {
                  console.log('Recieved verified wallet registration', data.wallet)
                  setWallet(data.wallet)
                  toastSuccess(`Wallet proof recieved ${data.wallet.did}`);
                  await loadWallets(currentUser.id)
                }
                
                break
              case 'WALLET_ERROR':
                console.log('WALLET ERROR', data.error)
                toastError(data.error)
                break
              
              case 'WALLET_CONNECTION_SUCCESS':
                  toastSuccess(`Connection established with wallet: ${data.did}`)
                  break
              case 'WALLET_PROOF_SENT':
                  toastSuccess(`Organisation Proof request sent to wallet: ${data.did}`)
                  break
    
              default:
                toastError(`Error - Unrecognized Websocket Message Type: ${type}`)
                break
            }
            break

        default:
          toastError(`Error - Unrecognized Websocket Message Type: ${context}`)
          break
      }
    } catch (error) {
      console.log('Error caught:', error)
      toastError(`Client Error - Websockets: ${error}`)
    }
  }

  function addLoadingProcess(process) {
    loadingArray.push(process)
  }

  function removeLoadingProcess(process) {
    const index = loadingArray.indexOf(process)

    if (index > -1) {
      loadingArray.splice(index, 1)
    }

    if (loadingArray.length === 0) {
      setAppIsLoaded(true)
    }
  }

  function setUpUser(id, email, roles) {
    setSession(cookies.get('sessionId'))
    setLoggedInUserId(id)
    setLoggedInEmail(email)
    setLoggedInRoles(roles)
  }

  // Update theme state locally
  const updateTheme = (update) => {
    return setTheme({ ...theme, ...update })
  }

  // Update theme in the database
  const saveTheme = () => {
    sendMessage('SETTINGS', 'SET_THEME', theme)
  }

  const addStylesToArray = (key) => {
    let position = stylesArray.indexOf(key)
    // if cannot find indexOf style
    if (!~position) {
      setStylesArray((oldArray) => [...oldArray, `${key}`])
    }
  }

  const removeStylesFromArray = (undoKey) => {
    // Removing a style from an array of styles
    let index = stylesArray.indexOf(undoKey)
    if (index > -1) {
      stylesArray.splice(index, 1)
      setStylesArray(stylesArray)
    }
  }

  // Undo theme change
  const undoStyle = (undoKey) => {
    if (undoKey !== undefined) {
      for (let key in defaultTheme)
        if ((key = undoKey)) {
          const undo = { [`${key}`]: defaultTheme[key] }
          return setTheme({ ...theme, ...undo })
        }
    }
  }

  // Resetting state of error and success messages
  const clearResponseState = () => {
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  const handleLogout = (history) => {
    setLoggedIn(false)
    setVerificationStatus()
    setVerifiedCredential('')
    setQRCodeURL('')
    setContacts([])
    cookies.remove('sessionId')
    cookies.remove('user')

    // Envision log out
    doLogout()

    if (history !== undefined) {
      history.push('/')
    }
  }

  if ((loggedIn && !appIsLoaded) || (!loggedIn && !appIsLoaded)) {
    // Show the spinner while the app is loading
    return (
      <ThemeProvider theme={theme}>
        <FullPageSpinner />
      </ThemeProvider>
    )
  } else if (!loggedIn && appIsLoaded) {
    return (
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <Router>
            <div className="main-layout">
              <MainToolbar
                showLoginModal = {() => showModal('login') }
                user={currentUser}
                handleLogout={handleLogout}
              />
            <Switch>
              <Route
                path="/forgot-password"
                render={({ match, history }) => {
                  return (
                    <Frame id="app-frame">
                      <Main>
                        <ForgotPassword
                          logo={image}
                          history={history}
                          sendRequest={sendMessage}
                          user={user}
                          users={users}
                        />
                      </Main>
                    </Frame>
                  )
                }}
              />
              <Route
                path="/password-reset"
                render={({ match, history }) => {
                  return (
                    <Frame id="app-frame">
                      <Main>
                        <PasswordReset
                          logo={image}
                          history={history}
                          sendRequest={sendMessage}
                          user={user}
                          users={users}
                        />
                      </Main>
                    </Frame>
                  )
                }}
              />
              <Route
                path="/account-setup"
                render={({ match, history }) => {
                  return (
                    <Frame id="app-frame">
                      <Main hasBackgroundColor>
                        <AccountSetup
                          logo={image}
                          history={history}
                          QRCodeURL={QRCodeURL}
                          accountCredentialIssued={accountCredentialIssued}
                          sendRequest={sendAnonMessage}
                          messageHandler={messageHandler}
                          user={user}
                          users={users}
                        />
                      </Main>
                    </Frame>
                  )
                }}
              />
              <Route
                path="/login"
                render={({ match, history }) => {
                  return (
                    <Frame id="app-frame">
                      <Main>
                        <Login
                          logo={image}
                          history={history}
                          setUpUser={setUpUser}
                          setLoggedIn={setLoggedIn}
                          QRCodeURL={QRCodeURL}
                          sendRequest={sendAnonMessage}
                          doLogin={doLoginClick}
                          contacts={contacts}
                          verificationStatus={verificationStatus}
                          verifiedCredential={verifiedCredential}
                        />
                      </Main>
                    </Frame>
                  )
                }}
              />
              <Route path="/" exact>
                <ReviewPage />
              </Route>
              <Redirect to={"/"}/>
            </Switch>
              <Modal
                handlePasswordLogin={handlePasswordLogin}
                QRCodeURL={QRCodeURL}
                verificationStatus={verificationStatus}
                setVerificationStatus={setVerificationStatus}
                handlePasswordlessLogin={handlePasswordlessLogin}
                sendRequest={sendAnonMessage}
                loggedInUserState={loggedInUserState}
                wallet={wallet}
                wallets={wallets}
                setScope1={setScope1}
              />
              <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={true}
                toastStyle={{ backgroundColor: "#007568", color: "white" }}
              />
            </div>
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    )
  } else {
    // loggedIn and appIsLoaded
    return (
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <SessionProvider logout={handleLogout} sessionTimer={sessionTimer}>
            <Router>
            <div className="main-layout">
              <MainToolbar
                showLoginModal = {() => showModal('login') }
                user={currentUser}
                handleLogout={handleLogout}
              />
              <Switch>  
                <Route exact path="/forgot-password">
                  <Redirect to="/" />
                </Route>
                <Route exact path="/password-reset">
                  <Redirect to="/" />
                </Route>
                <Route exact path="/account-setup">
                  <Redirect to="/" />
                </Route>
                <Route exact path="/login">
                  <Redirect to="/" />
                </Route>

                {
                  currentUser && ( 
                    <Route path="/account">
                      <AccountPage user={currentUser} />
                    </Route>
                  )
                }

                {
                  currentUser && ( 
                    <Route path="/register-wallet">
                      <RegisterWalletPage user={currentUser} sendRequest={sendMessage} QRCodeURL={QRCodeURL}/>
                    </Route>
                  )
                }
                <Route path="/" exact>
                  <ReviewPage />
                </Route>
                

                <Route
                  path="/admin"
                  exact
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          loggedInUserState={loggedInUserState}
                          logo={image}
                          organizationName={organizationName}
                          loggedInEmail={loggedInEmail}
                          match={match}
                          history={history}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <Home
                            loggedInUserState={loggedInUserState}
                            sendRequest={sendMessage}
                            QRCodeURL={QRCodeURL}
                            focusedConnectionID={focusedConnectionID}
                          />
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  path="/admin/invitations"
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          loggedInUserState={loggedInUserState}
                          loggedInEmail={loggedInEmail}
                          logo={image}
                          organizationName={organizationName}
                          match={match}
                          history={history}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <p>Invitations</p>
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  path="/admin/contacts"
                  exact
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          loggedInUserState={loggedInUserState}
                          loggedInEmail={loggedInEmail}
                          logo={image}
                          organizationName={organizationName}
                          match={match}
                          history={history}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <Contacts
                            loggedInUserState={loggedInUserState}
                            history={history}
                            sendRequest={sendMessage}
                            contacts={contacts}
                            QRCodeURL={QRCodeURL}
                            focusedConnectionID={focusedConnectionID}
                          />
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  path={`/admin/contacts/:contactId`}
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          loggedInUserState={loggedInUserState}
                          loggedInEmail={loggedInEmail}
                          logo={image}
                          organizationName={organizationName}
                          match={match}
                          history={history}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <Contact
                            loggedInUserState={loggedInUserState}
                            history={history}
                            sendRequest={sendMessage}
                            contactId={match.params.contactId}
                            contacts={contacts}
                            credentials={credentials}
                            schemas={schemas}
                          />
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  path="/admin/credentials"
                  exact
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          loggedInUserState={loggedInUserState}
                          loggedInEmail={loggedInEmail}
                          logo={image}
                          organizationName={organizationName}
                          match={match}
                          history={history}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <Credentials
                            history={history}
                            credentials={credentials}
                          />
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  path={`/admin/credentials/:credentialId`}
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          loggedInUserState={loggedInUserState}
                          loggedInEmail={loggedInEmail}
                          logo={image}
                          organizationName={organizationName}
                          match={match}
                        />
                        <Main>
                          <Credential
                            history={history}
                            credential={match.params.credentialId}
                            credentials={credentials}
                          />
                        </Main>
                      </Frame>
                    )
                  }}
                  credentials={credentials}
                />
                <Route
                  path="/admin/verification"
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          loggedInUserState={loggedInUserState}
                          loggedInEmail={loggedInEmail}
                          logo={image}
                          organizationName={organizationName}
                          match={match}
                          history={history}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <p>Verification</p>
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  path="/admin/messages"
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          loggedInUserState={loggedInUserState}
                          loggedInEmail={loggedInEmail}
                          logo={image}
                          organizationName={organizationName}
                          match={match}
                          history={history}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <p>Messages</p>
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  exact
                  path="/admin/users"
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          loggedInUserState={loggedInUserState}
                          loggedInEmail={loggedInEmail}
                          logo={image}
                          organizationName={organizationName}
                          match={match}
                          history={history}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <Users
                            loggedInUserState={loggedInUserState}
                            user={user}
                            users={users}
                            roles={roles}
                            organizations={organizations}
                            successMessage={successMessage}
                            errorMessage={errorMessage}
                            clearResponseState={clearResponseState}
                            sendRequest={sendMessage}
                          />
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  path={`/admin/users/:userId`}
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          loggedInUserState={loggedInUserState}
                          loggedInEmail={loggedInEmail}
                          logo={image}
                          organizationName={organizationName}
                          match={match}
                          history={history}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <User
                            logo={image}
                            organizationName={organizationName}
                            history={history}
                          />
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  exact
                  path="/admin/organizations"
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          loggedInUserState={loggedInUserState}
                          loggedInEmail={loggedInEmail}
                          logo={image}
                          organizationName={organizationName}
                          match={match}
                          history={history}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <Organizations
                            loggedInUserState={loggedInUserState}
                            organizations={organizations}
                            user={user}
                            successMessage={successMessage}
                            errorMessage={errorMessage}
                            clearResponseState={clearResponseState}
                            sendRequest={sendMessage}
                          />
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  path="/admin/account"
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          loggedInUserState={loggedInUserState}
                          loggedInEmail={loggedInEmail}
                          logo={image}
                          organizationName={organizationName}
                          match={match}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <Account
                            logo={image}
                            organizationName={organizationName}
                            history={history}
                            sendRequest={sendMessage}
                            QRCodeURL={QRCodeURL}
                            userID={loggedInUserId}
                          />
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  path="/admin/settings"
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          loggedInUserState={loggedInUserState}
                          loggedInEmail={loggedInEmail}
                          logo={image}
                          organizationName={organizationName}
                          match={match}
                          history={history}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <Settings
                            updateTheme={updateTheme}
                            saveTheme={saveTheme}
                            undoStyle={undoStyle}
                            errorMessage={errorMessage}
                            successMessage={successMessage}
                            clearResponseState={clearResponseState}
                            imageResponse={image}
                            stylesArray={stylesArray}
                            addStylesToArray={addStylesToArray}
                            removeStylesFromArray={removeStylesFromArray}
                            sendRequest={sendMessage}
                          />
                        </Main>
                      </Frame>
                    )
                  }}
                />
                {/* Redirect to root if no route match is found */}
                <Redirect to={"/"}/>
              </Switch>
                <Modal
                  handlePasswordLogin={handlePasswordLogin}
                  QRCodeURL={QRCodeURL}
                  scope1={scope1}
                  verificationStatus={verificationStatus}
                  setVerificationStatus={setVerificationStatus}
                  sendRequest={sendMessage}
                  loggedInUserState={loggedInUserState}
                  wallet={wallet}
                  wallets={wallets}
                  setScope1={setScope1}
                />
                <ToastContainer
                  position="bottom-right"
                  autoClose={2000}
                  hideProgressBar={true}
                  newestOnTop={true}
                  toastStyle={{ backgroundColor: "#007568", color: "white" }}
                />
              </div>
            </Router>
          </SessionProvider>
        </NotificationProvider>
      </ThemeProvider>
    )
  }
}

// Envision Map State to Props
const mapStateToProps = (state: RootState) => {
  return {
    currentUser: userSelectors.getCurrentUser(state),
    loading: userSelectors.getLoading(state),
    wallets: accountSelectors.getWallets(state),
    walletsLoaded: accountSelectors.getWalletsLoaded(state),
  }
}

const mapDispatchToProps = (dispatch: DispatchThunk) => {
  return {
    doLoginSuccess: (user) => {
      dispatch(doPaswordlessLoginSucess(user))
    },
    showModal: (type:string) => {
      dispatch(showModal(type))
    },
    doLogout: () => {
      dispatch(doLogout())
    },
    loadWallets: (orgId: string) => {
      dispatch(accountActions.doLoadWallets(orgId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)