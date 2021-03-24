/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from 'react'
import * as firebase from 'firebase/app'
import './ConversationListItem.css'
import { List, Badge, Avatar } from 'antd'
import { useQuery } from '@apollo/react-hooks'
import { GET_USER } from '@shared'
import { IContext } from '@tools'

export default function ConversationListItem(props) {
  const { id, members, lastMess } = props?.chat
  const { chooseConversation, isBroken } = props
  const { me } = useContext(IContext)
  const { data } = useQuery(GET_USER, {
    variables: { userId: members?.filter(item => item !== me?._id)[0] },
    skip: !members?.filter(item => item !== me?._id)[0]
  })
  useEffect(() => {
    data && props?.addSearch({ ...props?.chat, name: data?.getUser?.firstname })
  }, [data])
  const selectHandler = () => {
    isBroken
      ? props.history.push(
          `/${members?.filter(item => item !== me?._id)[0]}/messenger/${id}`
        )
      : chooseConversation(id, members?.filter(item => item !== me?._id)[0])
    firebase
      .database()
      .ref(`messenger/${id}`)
      .child('lastMess')
      .update({ seen: true })
  }

  return lastMess ? (
    <List.Item onClick={() => selectHandler()}>
      <List.Item.Meta
        avatar={
          <Badge dot={lastMess?.author !== me?._id && !lastMess?.seen}>
            <Avatar size={42} src={data?.getUser?.avatar} />
          </Badge>
        }
        title={data?.getUser?.firstname || 'Người dùng không tồn tại'}
        description={
          lastMess?.content?.message.trim() !== ''
            ? lastMess?.content?.message.trim()
            : lastMess?.content?.img
            ? lastMess?.author === me?._id
              ? 'Bạn đã gửi 1 hình'
              : `${data?.getUser?.firstname} đã gửi cho bạn 1 ảnh`
            : ''
        }
      />
    </List.Item>
  ) : (
    // <div></div>
    <List.Item
      onClick={() => {
        isBroken
          ? props?.history.push(
              `/${members?.filter(item => item !== me?._id)[0]}/messenger/${id}`
            )
          : chooseConversation(id, members?.filter(item => item !== me?._id)[0])
      }}
    >
      <List.Item.Meta
        avatar={<Avatar size={42} src={data?.getUser?.avatar} />}
        title={data?.getUser?.firstname}
        description="Bắt đầu cuộc trò chuyện"
      />
      {/* <ConversationListItem
      key={conversation.name}
        data={conversation} /> */}
    </List.Item>
  )
}
