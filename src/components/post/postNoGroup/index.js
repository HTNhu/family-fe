import React, { useState, useEffect, useContext } from 'react'
import * as firebase from 'firebase/app'
import { Card, Avatar, Typography, Tooltip, Space } from 'antd'
import { Reaction, SharePost, CommentPost, SaveAndReport } from '@components'
import { CommentOutlined, CheckCircleTwoTone } from '@ant-design/icons'
import { Meta } from 'antd/lib/list/Item'
import { useHistory } from 'react-router-dom'
import { Emoji } from 'emoji-mart'
import ReactionInfo from '../reactionInfo'
import { IContext } from '@tools'
import ModalReactionInfo from '../modalReactionInfo'
function PostNoGroup(props) {
  const { me } = useContext(IContext)
  const [showText, setShowText] = useState(props.showText || false)
  const [sum, setSum] = useState(0)
  const [sumReactions, setSSumReactions] = useState(0)
  const [currentEmoji, setCurrentEmoji] = useState('')
  const [reactions, setReactions] = useState([])
  const nameEl = showText ? 'expand' : 'collapse'
  const { item, refetch } = props
  const [visible, setVisible] = useState(false)
  const history = useHistory()
  useEffect(() => {
    getSum(item?._id)
  }, [item])
  const getSum = idPost => {
    let sumTemp = 0
    firebase
      .database()
      .ref(`posts/${idPost}/comments`)
      .once('value', snapshot => {
        sumTemp = snapshot.val() ? Object.keys(snapshot.val())?.length : 0
        setSum(sumTemp)
      })
  }
  useEffect(() => {
    setCurrentEmoji('')
    setReactions([])
    getReactionPost()
  }, [item])
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
              onClick={() => history.push(`/${item?.createdBy?._id}/info`)}
              size="large"
              src={
                item?.createdBy?.avatar ||
                'https://lh3.googleusercontent.com/proxy/6C5Z-8XG57kW_mwwDGrOz6PxPeVCy8D2cdZWKafAdYfyTxWRECggO74MhJSria5djCNtW-7r5bdxfSGoZhkqSyBN34OFbpfjwrc43LbI'
              }
            />
            <div style={{ marginLeft: 10 }}>
              <a
                onClick={() => history.push(`/${item?.createdBy?._id}/info`)}
                style={{ fontWeight: 'bolder', color: 'black' }}
              >
                {item?.createdBy?.firstname}{' '}
                {item?.createdBy?.expert?.isVerify && <CheckCircleTwoTone />}
              </a>
              <p style={{ color: '#9b9b9b', fontSize: 12 }}>
                {new Date(item?.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
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
                idPost={item?._id}
                postItem={item}
                reactions={reactions}
                currentEmoji={currentEmoji}
              />
            </div>,
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
              <SharePost key="share" post={item} />
            </div>,
            <div
              key="saveandreport"
              onClick={() =>
                document.getElementById(`input-custom-${item?._id}`).focus()
              }
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
        <Meta
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
                  document.getElementsByClassName(`collapse${item?._id}`)[0]
                    .lastElementChild.clientHeight > 500 ? (
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
                                onClick={() => setVisible(true)}
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
                                  {emo?.users?.slice(0, 3)?.map(user => (
                                    <ReactionInfo
                                      type="tooltip"
                                      key={user}
                                      userId={user}
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
                                  onClick={() => setVisible(true)}
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
export default PostNoGroup
