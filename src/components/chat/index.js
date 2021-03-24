import React, { useContext, useState, useEffect } from 'react'
import { Button } from 'antd'
import { MessageTwoTone } from '@ant-design/icons'
import { IContext } from '@tools'
import * as firebase from 'firebase/app'
function Chat(props) {
  const { members, history, isBroken, chooseConversation } = props
  const { me, isAuth, openLoginModal } = useContext(IContext)
  const [isExist, setIsExist] = useState(null)
  const idChat = `${members[0]}${members[1]}`
  useEffect(() => {
    firebase
      .database()
      .ref(`messenger/`)
      .on('value', snapshot => {
        const temp = snapshot.val()
          ? Object.keys(snapshot.val()).map(key => ({
              ...snapshot.val()[key],
              id: key
            }))
          : []

        temp.map(chat => {
          if (
            chat?.id === `${members[0]}${members[1]}` ||
            chat?.id === `${members[1]}${members[0]}`
          ) {
            setIsExist({
              idChat: chat?.id,
              userId: members.filter(mem => mem !== me?._id)[0]
            })
          }
        })
      })
  }, [])
  const openChat = e => {
    if (!isExist) {
      firebase
        .database()
        .ref(`messenger/${idChat}`)
        .set({
          idChat,
          members: members,
          lastActivity: +new Date()
        })
        .then(() => {
          chooseConversation(idChat, members.filter(mem => mem !== me?._id)[0])
        })
    } else {
      chooseConversation(isExist?.idChat, isExist?.userId)
    }
    // })
  }

  return isBroken ? (
    <MessageTwoTone
      style={{ fontSize: 20, marginLeft: 10 }}
      onClick={() => {
        if (!isExist) {
          firebase
            .database()
            .ref(`messenger/${idChat}`)
            .set({
              idChat,
              members: members,
              lastActivity: +new Date()
            })
            .then(() => {
              history.push(
                `/${
                  members.filter(mem => mem !== me?._id)[0]
                }/messenger/${idChat}`
              )
            })
        } else {
          history.push(
            `/${members.filter(mem => mem !== me?._id)[0]}/messenger/${
              isExist?.idChat
            }`
          )
        }
      }}
    />
  ) : (
    <Button
      type="ghost"
      icon={<MessageTwoTone />}
      onClick={e => {
        isAuth ? openChat(e) : openLoginModal()
      }}
    >
      Nhắn tin
    </Button>
  )
}
export default Chat
