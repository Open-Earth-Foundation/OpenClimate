import Axios from 'axios'
import Cookies from 'universal-cookie'
import { formatSeconds } from './util'

import React, { useEffect, useState } from 'react'

import {
  Actions,
  StyledPopup,
  SubmitBtnModal,
  Modal,
  ModalContent,
  ModalContentWrapper,
  ModalHeader,
  TextWrapper,
} from './CommonStylesForms'

const SessionAlertContext = React.createContext()

// Exporting the session alert component
export default function SessionAlertProvider(props) {
  const cookies = new Cookies()

  const [open, setOpen] = useState(false)
  const [timer, setTimer] = useState()
  const [keepAlive, setKeepAlive] = useState(true)
  const [idleCountdown, setIdleCountdown] = useState(299)
  const [finalCountdown, setFinalCountdown] = useState(300)

  useEffect(() => {
    setTimer(props.sessionTimer)
  }, [])

  // Setting the final countdown
  useEffect(() => {
    const secondsInterval = setInterval(() => {
      if (finalCountdown >= 0 && !keepAlive) {
        setFinalCountdown(finalCountdown - 1)
        SecondsTimer()
      }
    }, 1000)
    return () => {
      clearInterval(secondsInterval)
    }
  })

  // Resetting the session cookie and local timer
  useEffect(() => {
    if (timer === 5 && keepAlive)
      Axios({
        method: 'GET',
        url: '/api/session',
      }).then((res) => {
        console.log(res)
        if (res.status) setTimer(60)
      })
  }, [timer])

  const closeModal = () => {
    setOpen(false)
  }

  // Handling form submit
  const handleSubmit = (e) => {
    e.preventDefault()

    closeModal()
    setFinalCountdown(300)
    setKeepAlive(true)

    // Resetting the session cookie and local timer
    Axios({
      method: 'GET',
      url: '/api/session',
    }).then((res) => {
      console.log(res)
      if (res.status) setTimer(60)
    })
  }

  // Setting session timer
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (timer) {
        const updatedTimer = timer - 1

        if (updatedTimer === 0) props.logout()
        else setTimer(updatedTimer)
      }
    }, 60000)

    return () => {
      clearInterval(timerInterval)
    }
  }, [timer])

  // Setting idle countdown
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (idleCountdown > 0 && !open) {
        setIdleCountdown(idleCountdown - 1)
      } else if (idleCountdown === 0) {
        setOpen(true)
        setKeepAlive(false)
      }

      if (finalCountdown === 1) props.logout()
    }, 1000)

    const resetTimeout = () => {
      setIdleCountdown(299)
    }

    const events = [
      'load',
      'mousemove',
      'mousedown',
      'click',
      'scroll',
      'keydown',
    ]

    for (let i in events) {
      window.addEventListener(events[i], resetTimeout)
    }

    return () => {
      clearInterval(countdownInterval)

      for (let i in events) {
        window.removeEventListener(events[i], resetTimeout)
      }
    }
  }, [idleCountdown, finalCountdown])

  const SecondsTimer = () => {
    return (
      <TextWrapper>
        <h3>The session will expire in</h3>
        <br />
        <h2> {formatSeconds(finalCountdown)}</h2>
        <h3>Extend my session</h3>
      </TextWrapper>
    )
  }

  let sessionAlert = ''

  sessionAlert = (
    <StyledPopup open={open} closeOnDocumentClick={false} onClose={closeModal}>
      <Modal className="agent-modal">
        <ModalHeader>You've been inactive for a while...</ModalHeader>
        <form id="form" onSubmit={handleSubmit}>
          <ModalContentWrapper>
          <ModalContent>
            <SecondsTimer />
          </ModalContent>
          </ModalContentWrapper>
          <Actions>
            <SubmitBtnModal type="submit">Yes</SubmitBtnModal>
          </Actions>
        </form>
      </Modal>
    </StyledPopup>
  )

  return (
    <SessionAlertContext.Provider>
      {sessionAlert}
      {props.children}
    </SessionAlertContext.Provider>
  )
}
