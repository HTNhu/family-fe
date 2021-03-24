import React, { useContext } from 'react'

import * as firebase from 'firebase/app'
import moment from 'moment'
import {
  HeartTwoTone,
  MessageTwoTone,
  LikeTwoTone,
  FileTextTwoTone,
  SafetyCertificateTwoTone,
  MehTwoTone,
  VideoCameraTwoTone
} from '@ant-design/icons'
import { List, Avatar } from 'antd'
import '../index.scss'
import { IContext } from '@tools'

const arrType = [
  {
    type: 'seminar',
    icon: <VideoCameraTwoTone />
  },
  {
    type: 'cmt',
    icon: <MessageTwoTone />
  },
  {
    type: 'verify',
    icon: <SafetyCertificateTwoTone />
  },
  {
    type: 'reject',
    icon: <MehTwoTone twoToneColor="red" />
  },
  {
    type: 'tag',
    icon: <MessageTwoTone />
  },
  {
    type: 'follow',
    icon: <HeartTwoTone />
  },
  {
    type: 'reaction',
    icon: <LikeTwoTone />
  },
  {
    type: 'post',
    icon: <FileTextTwoTone />
  }
]

const NotiList = props => {
  const { me } = useContext(IContext)
  const { noti, history, setVisible } = props
  return (
    <List.Item
      className="noti-item"
      style={{
        padding: '0 12px',
        backgroundColor: noti.seen ? 'initial' : 'rgba(214, 234, 248, 0.8)'
      }}
      onClick={() => {
        firebase
          .database()
          .ref('notifications/' + me?._id + '/' + noti.id)
          .update({
            seen: true
          })
        noti?.action === 'seminar'
          ? window.open(`${noti.link}`)
          : history.push(`${noti.link}`)
        setVisible(false)
      }}
    >
      {/* <Skeleton avatar title={false} loading={item.loading} active> */}
      <List.Item.Meta
        avatar={
          <Avatar
            style={{ backgroundColor: 'initial' }}
            icon={arrType.filter(item => noti?.action === item.type)[0]?.icon}
          />
        }
        title={
          // <a
          // onClick={() => history.push(`${noti?.link}`)}
          // >
          noti.content.trim()
          // </a>
        }
        description={
          <p style={{ fontSize: 10 }}>
            {noti?.createdAt && moment(noti?.createdAt).fromNow()}
          </p>
        }
      />
      {/* <div>content</div> */}
      {/* </Skeleton> */}
    </List.Item>
  )
}
export default NotiList
