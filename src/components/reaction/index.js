/* eslint-disable react/prop-types */
import React, { useState, useContext, useLayoutEffect } from 'react'
import { Popover, Tooltip, Space } from 'antd'
import { Emoji } from 'emoji-mart'
import { LikeOutlined } from '@ant-design/icons'
import * as firebase from 'firebase/app'
import './index.css'
import { IContext } from '@tools'

const emojiData = [
  {
    emoji: '+1',
    text: 'Thích',
    count: 7
  },
  {
    emoji: 'heart_eyes',
    text: 'Yêu thích',
    count: 3
  },
  {
    emoji: 'open_mouth',
    text: 'Wow',
    count: 9
  },
  {
    emoji: 'joy',
    text: 'Hihi',
    count: 43
  }
]
// const me._id = 'tuikyne'
function Reaction(props) {
  const { idPost, postItem, currentEmoji, setCurrentEmoji, reactions } = props

  const { me, isAuth, openLoginModal } = useContext(IContext)
  const updateOrSet = (e, emo) => {
    const vt = reactions?.findIndex(reaction => reaction.id === e.id)
    reactions[vt]
      ? firebase
          .database()
          .ref(`posts/${props.idPost}/reactions/` + e.id)
          .update({
            count: reactions[vt].count + 1,
            users: reactions[vt].users
              ? [...reactions[vt].users, me._id]
              : [me._id]
          })
      : firebase
          .database()
          .ref(`posts/${props.idPost}/reactions/` + e.id)
          .set({
            count: 1,
            users: [me._id]
          })
    postItem?.createdBy?._id !== me?._id &&
      firebase
        .database()
        .ref(`notifications/${postItem?.createdBy?._id}/${+new Date()}`)
        .set({
          action: 'reaction',
          reciever: postItem?.createdBy?._id,
          link: `/post-detail/${idPost}`,
          content: `${me?.firstname} đã ${emo.text} bài viết của bạn`,
          seen: false,
          createdAt: +new Date()
        })
  }
  const onClickEmoji = (e, emo) => {
    if (currentEmoji !== '') {
      if (currentEmoji !== e.id) {
        const idx = reactions.findIndex(
          reaction => reaction.id === currentEmoji
        )
        const arr = reactions[idx]?.users
        arr?.splice(
          reactions[idx].users.findIndex(user => user === me._id),
          1
        )
        try {
          firebase
            .database()
            .ref(`posts/${props.idPost}/reactions/` + currentEmoji)
            .update({
              count: reactions[idx].count - 1,
              users: arr
            })
          updateOrSet(e, emo)
        } catch (e) {
          console.log(e)
        }
      }
    } else {
      setCurrentEmoji(e.id)
      updateOrSet(e, emo)
    }
    document
      .getElementById('like-post')
      .setAttribute('style', 'background-color: #f5f5f5')
  }
  return (
    <Popover
      overlayClassName="reaction-popover"
      content={
        <Space>
          {emojiData.map(emo => (
            <Tooltip key={emo.emoji} title={emo.text}>
              <div style={{ height: 18, width: 18 }}>
                <Emoji
                  emoji={emo.emoji}
                  size={24}
                  onClick={e =>
                    isAuth ? onClickEmoji(e, emo) : openLoginModal()
                  }
                />
              </div>
            </Tooltip>
          ))}
        </Space>
      }
    >
      {currentEmoji ? (
        <Space>
          <Emoji
            onClick={async () => {
              const idx = reactions.findIndex(
                reaction => reaction.id === currentEmoji
              )
              const arr = reactions[idx].users
              arr.splice(
                reactions[idx].users.findIndex(user => user === me._id),
                1
              )
              try {
                await firebase
                  .database()
                  .ref(`posts/${props.idPost}/reactions/` + currentEmoji)
                  .update({
                    count: reactions[idx].count - 1,
                    users: arr
                  })
              } catch (e) {
                console.log(e)
              }
              setCurrentEmoji('')
              document
                .getElementById('like-post')
                .setAttribute('style', 'background-color: initial')
            }}
            emoji={currentEmoji}
            size={19}
          />
          {window.innerWidth > 600 && (
            <span style={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }}>
              {emojiData.filter(e => e.emoji === currentEmoji)[0].text}
            </span>
          )}
        </Space>
      ) : (
        <LikeOutlined />
      )}
      {/* <span
        style={{
          marginLeft: 5,
          fontWeight: 'bold',
          color: currentEmoji && '#1890ff'
        }}
      >
        {sumReactions}
      </span> */}
      {/* </Space> */}
    </Popover>
  )
}
export default Reaction
