import React, { useState, useContext, useEffect } from 'react'
import * as firebase from 'firebase/app'
import { Card, Avatar, Typography, Space, Tooltip } from 'antd'
import {
  Reaction,
  SharePost,
  CommentPost,
  SaveAndReport,
  JoinBtn
} from '@components'
import { CommentOutlined, CheckCircleTwoTone } from '@ant-design/icons'
import { IContext } from '@tools'
import { Emoji } from 'emoji-mart'
import ReactionInfo from '../reactionInfo'
import ModalReactionInfo from '../modalReactionInfo'

function PostHaveGroup(props) {
  const [showText, setShowText] = useState(props.showText || false)
  const { me } = useContext(IContext)
  const [sum, setSum] = useState(0)
  const nameEl = showText ? 'expand' : 'collapse'
  const { item, refetch, history } = props
  const [sumReactions, setSSumReactions] = useState(0)
  const [currentEmoji, setCurrentEmoji] = useState('')
  const [reactions, setReactions] = useState([])
  const [visible, setVisible] = useState(false)
  // const history = useHistory()
  useEffect(() => {
    getSum(item?._id)
  }, [item?._id])
  const getSum = idPost => {
    let sumTemp = 0
    firebase
      .database()
      .ref(`posts/${idPost}/comments`)
      .on('value', snapshot => {
        sumTemp = snapshot.val() ? Object.keys(snapshot.val())?.length : 0
        setSum(sumTemp)
      })
  }
  useEffect(() => {
    setCurrentEmoji('')
    setReactions([])
    getReactionPost()
  }, [item?._id])
  const getReactionPost = () => {
    firebase
      .database()
      .ref(`posts/${item?._id}/reactions`)
      .on('value', snapshot => {
        // var mess = (snapshot.val() && snapshot.val().mess1) || 'Anonymous';
        const temp =
          (snapshot.val() &&
            Object.keys(snapshot.val()).map(key => ({
              ...snapshot.val()[key],
              id: key.toString()
            }))) ||
          []
        temp.sort((a, b) => b.timestamp - a.timestamp)
        setReactions(temp)
        let count = 0
        temp.map(item => {
          if (!item.users) return
          const idx = item.users.findIndex(user => user === me?._id)
          if (idx !== -1) {
            setCurrentEmoji(item.id)
          }
          count += item.count
        })
        setSSumReactions(count)
      })
  }
  return (
    <>
      <Card
        className="post"
        title={
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Avatar
              shape="square"
              onClick={() =>
                history.push(`/page-group/${item?.community?._id}`)
              }
              size={64}
              src={item?.community?.avatar}
            />
            <div style={{ marginLeft: 10 }}>
              <a
                onClick={() =>
                  history.push(`/page-group/${item?.community?._id}`)
                }
                style={{ fontWeight: 'bolder', color: 'black' }}
              >
                {item?.community?.name}
              </a>
              <p style={{ color: '#9b9b9b', fontSize: 12 }}>
                Đăng bởi
                <span style={{ color: '#003b70' }}>
                  <a
                    onClick={() =>
                      history.push(`/${item?.createdBy?._id}/info`)
                    }
                  >
                    {' '}
                    {item?.createdBy?.firstname + ' '}{' '}
                    {item?.createdBy?.expert?.isVerify && (
                      <CheckCircleTwoTone />
                    )}{' '}
                  </a>
                </span>
                - {new Date(item?.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        }
        extra={
          window.innerWidth > 600 &&
          process.env.ADMIN_SERVER === 'false' && (
            <JoinBtn
              id={{ userId: me?._id, communityId: item?.community?._id }}
              history={history}
            ></JoinBtn>
          )
        }
        style={{ maxWidth: '100%', marginBottom: 10 }}
        actions={
          process.env.ADMIN_SERVER === 'false' && [
            <div
              id="like-post"
              key="like"
              style={{
                padding: 10,
                backgroundColor: currentEmoji && 'aliceblue'
              }}
            >
              <Reaction
                setCurrentEmoji={setCurrentEmoji}
                reactions={reactions}
                currentEmoji={currentEmoji}
                idPost={item?._id}
                postItem={item}
              />
            </div>,
            // <Sum idPost ={item.postId} ></Sum>,
            <div
              key="comment"
              onClick={() =>
                document.getElementById(`input-custom-${item?._id}`).focus()
              }
              style={{
                padding: 10
              }}
            >
              <CommentOutlined
                onClick={() =>
                  document.getElementById(`input-custom-${item?._id}`).focus()
                }
              />
              <span style={{ marginLeft: 5, fontWeight: 'bold' }}>{sum}</span>
            </div>,
            <div
              key="share"
              style={{
                padding: 10
              }}
            >
              <SharePost post={item} />
            </div>,
            <div
              key="saveandreport"
              style={{
                padding: 10
              }}
            >
              <SaveAndReport
                refetch={refetch}
                postId={item?._id}
                postItem={item}
              />
            </div>,
            <CommentPost
              hashNoti={props.hashNoti}
              idPost={item?._id}
              postItem={item}
              key="commet"
            ></CommentPost>
          ]
        }
      >
        <Card.Meta
          className="post-meta"
          title={
            <a onClick={() => history.push(`/post-detail/${item?._id}`)}>
              <Typography.Title level={4}>{item?.title}</Typography.Title>
            </a>
          }
          description={
            <div>
              <div>
                <p
                  dangerouslySetInnerHTML={{
                    __html: `<div>${item?.content}<p>${
                      item?.keywords
                        ? item?.keywords
                            .map(key => `#${key.replace(/\s/g, '_')}`)
                            .join(' ')
                        : ''
                    }</p></div>`
                  }}
                  className={`content ${nameEl}${item?._id}`}
                  style={{
                    height: showText ? 'auto' : '3em',
                    overflow: 'hidden'
                  }}
                />
                {!showText &&
                  (document.getElementsByClassName(`collapse${item?._id}`)[0] &&
                  document
                    .getElementsByClassName(`collapse${item?._id}`)[0]
                    .getElementsByTagName('div')[0]?.clientHeight > 900 ? (
                    <a
                      href={`${window.location.origin}/post-detail/${item?._id}`}
                      target="blank"
                      id={`${nameEl}${item?._id}`}
                    >
                      Xem thêm
                    </a>
                  ) : (
                    <a onClick={() => setShowText(!showText)}>Xem thêm</a>
                  ))}
                {/* )} */}
                <img
                  src={item?.thumbnail}
                  style={{
                    width: '100%',
                    objectFit: 'cover',
                    marginBottom: 10
                  }}
                ></img>
              </div>
              {sumReactions !== 0 && (
                <div key="react-info" style={{ textAlign: 'left' }}>
                  {window.innerWidth <= 600 ? (
                    <Space>
                      <div style={{ display: 'flex' }}>
                        {reactions
                          ?.filter(reaction => reaction?.count !== 0)
                          ?.map(emo => (
                            <div key={emo.id} style={{ width: 18, height: 18 }}>
                              <Emoji
                                emoji={emo.id}
                                size={18}
                                onClick={() => {
                                  setVisible(true)
                                }}
                              />
                            </div>
                          ))}
                      </div>
                      <span
                        style={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }}
                      >
                        {sumReactions === 0 ? '' : sumReactions}
                      </span>
                    </Space>
                  ) : (
                    <Space>
                      <div style={{ display: 'flex' }}>
                        {reactions
                          ?.filter(reaction => reaction?.count !== 0)
                          ?.map(emo => (
                            <Tooltip
                              key={emo.id}
                              title={
                                <div>
                                  {emo?.users?.slice(0, 10)?.map(user => (
                                    <ReactionInfo
                                      key={user}
                                      userId={user}
                                      type="tooltip"
                                    />
                                  ))}
                                  {emo?.users?.length > 10 && (
                                    <p>{`... ${
                                      emo?.users?.length - 10
                                    } người khác`}</p>
                                  )}
                                </div>
                              }
                            >
                              <div style={{ width: 18, height: 18 }}>
                                <Emoji
                                  emoji={emo.id}
                                  size={18}
                                  onClick={() => {
                                    setVisible(true)
                                  }}
                                />
                              </div>
                            </Tooltip>
                          ))}
                      </div>
                      <span
                        style={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }}
                      >
                        {sumReactions === 0 ? '' : sumReactions}
                      </span>
                    </Space>
                  )}
                </div>
              )}
            </div>
          }
        />
      </Card>
      <ModalReactionInfo
        reactions={reactions}
        visible={visible}
        setVisible={setVisible}
      />
    </>
  )
}
export default PostHaveGroup
