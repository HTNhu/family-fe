/* eslint-disable react/prop-types */
import React, { useEffect, useState, useContext } from 'react'
import * as firebase from 'firebase/app'
import Message from './Message'
import moment from 'moment'
import './index.scss'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Card, Avatar } from 'antd'
import { InputCustomize } from '@components'
import { withRouter } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { IContext } from '@tools'
import { GET_USER } from '@shared'
moment().format()
// const MY_USER_ID = 'tuinhune'
function MessageDetail(props) {
  const [showMore, setShowMore] = useState(15)
  const [messages, setMessages] = useState([])
  const { idChat, userId } = props.match.params
  const { me } = useContext(IContext)
  const ele = document.getElementsByClassName(
    `message-list-container-phone ${idChat}`
  )[0]
  useEffect(() => {
    getMessages()
    if (ele) ele.scrollTop = ele.scrollHeight
    document.getElementById(`input-custom-${idChat}`).focus()
  }, [ele])
  useEffect(() => {
    getMessages()
  }, [showMore])
  const { data } = useQuery(GET_USER, { variables: { userId } })
  const getMessages = () => {
    firebase
      .database()
      .ref(`messenger/${idChat}/listmessages`)
      .orderByKey()
      .limitToLast(showMore)
      .on('value', snapshot => {
        // var mess = (snapshot.val() && snapshot.val().mess1) || 'Anonymous';
        const temp = snapshot.val()
          ? Object.keys(snapshot.val()).map(key => ({
              ...snapshot.val()[key],
              id: key
            }))
          : []
        // temp.sort((a, b) => a.timestamp - b.timestamp)
        setMessages(temp)
      })
  }

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
    try {
      const message = +new Date()
      await firebase
        .database()
        .ref(`messenger/${idChat}/listmessages/` + message)
        .update({
          content: { message: value, img: imgList },
          timestamp: +new Date(),
          author: me?._id,
          seen: false,
          hideWith: []
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
      `message-list-container-phone ${idChat}`
    )[0]
    ele.scrollTop = ele.scrollHeight
  }

  return (
    <div className="message-list-phone">
      <Card
        title={
          <>
            <Avatar
              onClick={() => props.history.push(`/${userId}/info`)}
              src={data?.getUser?.avatar}
            ></Avatar>
            <a
              onClick={() => props.history.push(`/${userId}/info`)}
              style={{ marginLeft: 5 }}
            >
              {data?.getUser?.firstname}
            </a>
          </>
        }
        className="ant-mess-phone"
        extra={
          <ArrowLeftOutlined
            className="delete-messbox"
            onClick={() => props.history.goBack()}
            style={{ color: '#ccc', fontSize: 20 }}
          />
        }
        actions={[
          <InputCustomize
            minRows={1}
            maxRows={4}
            idElement={idChat}
            type="chat"
            onSubmit={handleSubmit}
            placeholder="Nhập tin nhắn"
            key="input"
          />
        ]}
      >
        <div
          className={`message-list-container-phone ${idChat}`}
          onScroll={() => {
            const ele = document.getElementsByClassName(
              `message-list-container-phone ${idChat}`
            )[0]
            if (showMore <= messages?.length && ele.scrollTop === 0) {
              setShowMore(showMore + 3)
              ele.scrollTop = 100
            }
          }}
        >
          {renderMessages()}
        </div>
      </Card>
    </div>
  )
}
export default withRouter(MessageDetail)
