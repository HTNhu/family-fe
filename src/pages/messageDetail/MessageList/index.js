/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from 'react'
import * as firebase from 'firebase/app'
import moment from 'moment'
import './MessageList.scss'
import { CloseCircleFilled } from '@ant-design/icons'
import { Card, Avatar } from 'antd'

import { InputCustomize } from '@components'
import Message from '../Message'
import { IContext } from '@tools'
import { useQuery } from '@apollo/react-hooks'
import { GET_USER } from '@shared'
moment().format()

export default function MessageList(props) {
  // const [messages, setMessages] = useState([])
  const {
    chatBox,
    onCancelMessbox,
    showMore,
    setShowMore,
    currentId
  } = props
  const { idChat, userId, messages, isScale } = chatBox
  const { me } = useContext(IContext)
  useEffect(() => {
    // chatBox
  }, [chatBox])
  const { data } = useQuery(GET_USER, {
    variables: { userId }
    // fetchPolicy: 'no-cache'
  })
  useEffect(() => {
    if (document.getElementById(`input-custom-${currentId}`)) {
      // document.getElementById(`input-custom-${idChat}`).value = ''
      document.getElementById(`input-custom-${currentId}`).focus()
    }
  }, [currentId])
  const renderMessages = () => {
    let i = 0
    const messageCount = messages?.length
    const tempMessages = []

    while (i < messageCount) {
      const previous = messages[i - 1]
      const current = messages[i]
      const next = messages[i + 1]
      const isMine = current.author === me?._id
      const currentMoment = moment(current.timestamp)
      let prevBySameAuthor = false
      let nextBySameAuthor = false
      let startsSequence = true
      let endsSequence = true
      let showTimestamp = true

      if (previous) {
        const previousMoment = moment(previous.timestamp)
        const previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        )
        prevBySameAuthor = previous.author === current.author

        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false
        }

        if (previousDuration.as('hours') < 1) {
          showTimestamp = false
        }
      }

      if (next) {
        const nextMoment = moment(next.timestamp)
        const nextDuration = moment.duration(nextMoment.diff(currentMoment))
        nextBySameAuthor = next.author === current.author

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false
        }
      }

      tempMessages.push(
        <Message
          idChat={idChat}
          isLast={messageCount - 1 === i}
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      )

      // Proceed to the next message.
      i += 1
    }
    return tempMessages
  }
  const handleSubmit = async (value, imgList) => {
    const message = +new Date()
    try {
      firebase
        .database()
        .ref(`messenger/${idChat}/listmessages/` + message)
        .set({
          content: { message: value, img: imgList },
          timestamp: +new Date(),
          author: me?._id,
          seen: false,
          hideWith: []
        })
        .then(() => {
          props.showMess(idChat)
        })
      await firebase
        .database()
        .ref(`messenger/${idChat}`)
        .update({
          lastMess: {
            content: { message: value, img: imgList },
            timestamp: +new Date(),
            author: me?._id,
            seen: false,
            hideWith: []
          },
          lastActivity: +new Date()
        })
    } catch (error) {
      console.log(error)
    }
    const ele = document.getElementsByClassName(
      `message-list-container ${idChat}`
    )[0]
    ele.scrollTop = ele.scrollHeight
  }

  const { history } = props

  return (
    <div className={`message-list ${idChat}`}>
      <Card
        title={
          <div>
            <Avatar
              src={data?.getUser?.avatar}
              onClick={() => history.push(`/${data?.getUser?._id}/info`)}
            ></Avatar>
            <a
              style={{ marginLeft: 5 }}
              onClick={() => history.push(`/${data?.getUser?._id}/info`)}
            >
              {data?.getUser?.firstname}
            </a>
          </div>
        }
        className="ant-mess"
        extra={
          <CloseCircleFilled
            className="delete-messbox"
            onClick={onCancelMessbox}
            style={{ color: '#ccc' }}
          />
          // )
        }
        actions={
          !isScale && [
            <InputCustomize
              minRows={1}
              maxRows={4}
              idElement={idChat}
              type="chat"
              onSubmit={handleSubmit}
              placeholder="Nhập tin nhắn"
              key="input"
            />
          ]
        }
      >
        {!isScale && (
          <div
            className={`message-list-container ${idChat}`}
            onScroll={() => {
              const ele = document.getElementsByClassName(
                `message-list-container ${idChat}`
              )[0]
              props.showMess(idChat)
              if (showMore <= messages?.length && ele.scrollTop === 0) {
                setShowMore(showMore + 3)
                ele.scrollTop = 30
              }
            }}
          >
            <div className="spin-chat">{/* <Spin spinning={loading} /> */}</div>
            {renderMessages()}
          </div>
        )}
      </Card>
    </div>
  )
}
