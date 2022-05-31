import React, { useContext, useEffect, useState } from 'react'

import styled from 'styled-components'

const NotificationWrapper = styled.div`
  padding: 20px;
  background-color: ${(props) =>
    props.background === 'notice'
      ? `${props.theme.positive_color}`
      : props.background === 'warning'
      ? `${props.theme.warning_color}`
      : props.background === 'error'
      ? `${props.theme.negative_color}`
      : `${props.theme.negative_color}`};
  color: #fff;
  margin-bottom: 15px;
  position: fixed;
  top: 0;
  margin-left: 30%;
  width: 40%;
  height: 65px;
  text-align: center;
  transition: 6s;
  z-index: 99999999;
`

const NotificationCloseBtn = styled.span`
  margin-left: 15px;
  color: #fff;
  font-weight: bold;
  float: right;
  font-size: 22px;
  line-height: 20px;
  cursor: pointer;
`

const NotificationContext = React.createContext()

// Making the functionality of adding new notifications possible across the app using context provider
export function useNotification() {
  return useContext(NotificationContext)
}

// Exporting the notification component itself
export function NotificationProvider(props) {
  // Notification list state
  let [notificationList, setNotificationList] = useState([])

  // Perform on every notificationList render
  useEffect(() => {
    //  Check if list of notifications is not empty
    if (notificationList != 0) {
      // Copy the notification list array
      const array = [...notificationList]
      // Setting up the timer to remove the last notification from the array every 6 seconds
      let timer = setTimeout(function () {
        // Remove last notification from the list
        array.pop()
        // Reset notificationList state with updated array
        setNotificationList(array)
      }, 6000)

      // This will clear timeout when component unmount
      return () => {
        clearTimeout(timer)
      }
    }
  }, [notificationList])

  // Receiving new notification
  function setNotifications(message, type) {
    // Saving notification into a variable
    const newNotification = { message, type }
    // Adding notification to a list
    setNotificationList((oldArray) => [...oldArray, newNotification])
  }

  // Closing notification
  function closeNotification() {
    // Copying an array
    const array = [...notificationList]
    // Removing last notification from an array
    array.pop()
    // Saving edited array back to the list
    setNotificationList(array)
  }

  // Returning notifications
  let notifications = []
  let background = ''

  // Checking notification list status, comment in to use.
  // console.log(notificationList)

  // Mapping through the list of notifications
  notifications = notificationList.map(function (notification, index) {
    // Deciding the background color of the notification based on the type
    switch (notification.type) {
      case 'notice':
        background = 'notice'
        break
      case 'warning':
        background = 'warning'
        break
      case 'error':
        background = 'error'
        break
      default:
        background = 'error'
    }
    // Returning notification component
    return [
      <NotificationWrapper key={index} background={background}>
        <NotificationCloseBtn
          onClick={() => {
            closeNotification()
          }}
        >
          &times;
        </NotificationCloseBtn>
        <p>{notification.message}</p>
      </NotificationWrapper>,
    ]
  })

  // Returning notification provider
  return (
    <NotificationContext.Provider value={setNotifications}>
      {notifications}
      {props.children}
    </NotificationContext.Provider>
  )
}
