import React from 'react'
import { Menu } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'

export default function MenuInfo({ type, userId, isBroken, isMe, history }) {
  return (
    <Menu
      selectedKeys={[type]}
      style={{
        marginTop: -30,
        // color: 'black',
        fontSize: 15,
        fontWeight: 550,
        width: isBroken ? '60vw' : '35vw',
        backgroundColor: 'initial'
      }}
      overflowedIndicator={<EllipsisOutlined color="black" />}
      mode="horizontal"
    >
      <Menu.Item onClick={() => history.push(`/${userId}/info`)} key="info">
        Thông tin
      </Menu.Item>
      {/* {isBroken && (
        <Menu.Item
          onClick={() => history.push(`/${userId}/messenger`)}
          key="mail"
        >
          Tin nhắn
        </Menu.Item>
      )} */}
      {isMe && (
        <Menu.Item
          onClick={() => history.push(`/${userId}/savedposts`)}
          key="savedposts"
        >
          Bài viết đã lưu
        </Menu.Item>
      )}
      <Menu.Item
        onClick={() => history.push(`/${userId}/myposts`)}
        key="myposts"
      >
        Bài viết của tôi
      </Menu.Item>
      <Menu.Item
        onClick={() => history.push(`/${userId}/joinedGroup`)}
        key="joinedGroup"
      >
        Cộng đồng đã tham gia
      </Menu.Item>
    </Menu>
  )
}
