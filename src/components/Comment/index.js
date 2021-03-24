/* eslint-disable react/prop-types */
import React, { useState, useContext, useLayoutEffect, useEffect } from 'react'
import { Comment, Avatar, List } from 'antd'
import * as firebase from 'firebase/app'
import './index.scss'
import { InputCustomize } from '@components'
import { useHistory } from 'react-router-dom'
import { IContext } from '@tools'
import CommentItem from './CommentItem'
import { replaceToxicWords } from '@shared'

const CommentList = ({ comments, showMore, idPost, hashNoti, setHashNoti }) => {
  const history = useHistory()
  const { me, isAuth, openLoginModal } = useContext(IContext)
  const [rep, setRep] = useState({})

  const [showMoreRep, setShowMoreRep] = useState({ idParent: null, rows: 0 })
  const [arrTag, setArrTag] = useState([])
  let lessComment = []
  lessComment =
    showMore < comments.length ? comments.slice(0, showMore) : comments
  useEffect(() => {
    var elmnt =
      hashNoti && hashNoti.length !== 1
        ? document.getElementById(`parent-cmt-${hashNoti[1]}`)
        : null
    elmnt && elmnt.scrollIntoView()
    hashNoti &&
      hashNoti?.length !== 1 &&
      document.getElementById(`input-custom-${idPost}`).focus()
  }, [])
  const onAdd = mentions => {
    setArrTag(mentions)
  }
  const replyTo = repTo => {
    setRep(repTo)
  }
  const sendNotiTagReply = async (postId, idCmt) => {
    const notificationId = +new Date()
    arrTag &&
      arrTag.map(async item => {
        try {
          item?.id !== me?._id &&
            (await firebase
              .database()
              .ref('notifications/' + item?.id + '/' + notificationId)
              .set({
                action: 'tag',
                id: rep.commentId,
                reciever: item?.id,
                link: `/post-detail/${postId}#${rep.commentId}#${idCmt}`,
                content: `${me?.firstname} đã nhắc đến bạn trong bình luận`,
                seen: false,
                createdAt: +new Date()
              }))
        } catch (err) {
          console.log(err)
        }
      })
  }
  const reply = async (value, img) => {
    const cmtMention = (await comments.filter(
      item => item.id === rep.commentId
    )[0].mention)
      ? comments.filter(item => item.id === rep.commentId)[0].mention
      : []

    const mentions =
      cmtMention.findIndex(item => item.id === me?._id) === -1
        ? [
            ...cmtMention,
            {
              id: `${me?._id}`,
              name: `${me?.firstname}`
            }
          ]
        : [...cmtMention]
    const idCmt = new Date().getTime()
    try {
      await firebase
        .database()
        .ref(`posts/${idPost}/comments/${rep.commentId}/replies/${idCmt}`)
        .set({
          content: { message: value, img: img && img },
          timestamp: new Date().getTime(),
          author: me?._id
        })
      await firebase
        .database()
        .ref(`posts/${idPost}/comments/` + rep.commentId)
        .update({
          mention: mentions // replies: repValue
        })
      if (replaceToxicWords(value).trim() !== value.trim()) {
        firebase
          .database()
          .ref(`reports/comments/${me?._id}/${+new Date()}`)
          .set({
            id: rep.commentId,
            repId: idCmt,
            postId: idPost,
            reason: value,
            createdAt: +new Date()
          })
      }
    } catch (error) {
      console.log(error)
    }
    await sendNotiTagReply(idPost, idCmt)
    setRep({})
  }
  return (
    <>
      <List
        dataSource={comments?.length <= showMore ? comments : lessComment}
        // header={`${comments?.length} ${comments?.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={comment => {
          return (
            <>
              <CommentItem
                idPost={idPost}
                id={comment.id}
                key={comment.id}
                comment={comment}
                idParent={comment.id}
                replyTo={isAuth ? replyTo : () => openLoginModal()}
                type="parent"
                history={history}
              ></CommentItem>
              {rep.commentId === comment.id && (
                <Comment
                  className={`rep-input ${comment.id}`}
                  avatar={<Avatar src={me?.avatar} alt="Han Solo" />}
                  content={
                    <InputCustomize
                      replyAuthor={rep && rep.author}
                      idElement={comment.id}
                      onSubmit={isAuth ? reply : () => openLoginModal()}
                      placeholder="Nhập bình luận"
                      mentions={comment.mention}
                      onAdd={onAdd}
                    />
                  }
                />
              )}
              {comment.repliesArr &&
                comment.repliesArr?.length - 1 > showMoreRep.rows && (
                  <a
                    style={{ textAlign: 'left', marginLeft: '10%' }}
                    onClick={() => {
                      setShowMoreRep({
                        idParent: comment.id,
                        rows:
                          comment.id === showMoreRep.idParent
                            ? showMoreRep.rows + 1
                            : 1
                      })
                      setHashNoti([])
                    }}
                  >
                    Xem thêm{' '}
                    {comment.id === showMoreRep.idParent
                      ? comment.repliesArr?.length - showMoreRep.rows - 1
                      : comment.repliesArr?.length - 1}{' '}
                    câu trả lời
                  </a>
                )}
              {comment.repliesArr &&
                (hashNoti && hashNoti[2]
                  ? comment.repliesArr
                      .filter(item => item.id === hashNoti[2])
                      .map((reply, idx) => (
                        <CommentItem
                          idPost={idPost}
                          key={idx}
                          comment={reply}
                          idParent={comment.id}
                          replyTo={replyTo}
                          type="reply"
                          history={history}
                        />
                      ))
                  : comment.repliesArr
                      .sort((a, b) => a.timestamp - b.timestamp)
                      .slice(
                        comment.id === showMoreRep?.idParent
                          ? comment.repliesArr.length - showMoreRep.rows - 1
                          : comment.repliesArr.length - 1,
                        comment.repliesArr.length
                      )
                      .map((reply, idx) => (
                        <CommentItem
                          idPost={idPost}
                          key={idx}
                          comment={reply}
                          idParent={comment.id}
                          replyTo={replyTo}
                          type="reply"
                          history={history}
                        />
                      )))}
            </>
          )
        }}
      />
    </>
  )
}

function CommentPost(props) {
  const [comments, setComments] = useState([])
  const [showMore, setShowMore] = useState(1)

  const { me, isAuth, openLoginModal } = useContext(IContext)
  const { idPost, postItem, hashNoti } = props
  const [hash, setHash] = useState(hashNoti)
  const [cmtNoti, setCmtNoti] = useState(null)
  useLayoutEffect(() => {
    idPost && getComment()
  }, [idPost])
  const getComment = () => {
    firebase
      .database()
      .ref(`posts/${idPost}/comments`)
      .orderByKey()
      .on('value', snapshot => {
        const temp = snapshot.val()
          ? Object.keys(snapshot.val()).map(key => ({
              ...snapshot.val()[key],
              id: key,
              repliesArr: snapshot.val()[key].replies
                ? Object.keys(snapshot.val()[key].replies).map(keyA => ({
                    ...snapshot.val()[key].replies[keyA],
                    id: keyA
                  }))
                : []
            }))
          : []

        hash && hash[1] && setCmtNoti(temp.filter(item => item.id === hash[1]))
        setComments(temp.reverse())
      })
  }
  const handleSubmit = async (value, img) => {
    const postId = idPost
    const commentId = +new Date()
    const mentions = [
      {
        id: `${me?._id}`,
        name: `${me?.firstname}`
      }
    ]
    try {
      await firebase
        .database()
        .ref(`posts/${postId}/comments/` + commentId)
        .set({
          content: { message: value, img: img },
          timestamp: new Date().getTime(),
          author: me?._id,
          // photo: me?.avatar,
          mention: mentions,
          replies: []
        })
      if (replaceToxicWords(value).trim() !== value.trim()) {
        firebase
          .database()
          .ref(`reports/comments/${me?._id}/${+new Date()}`)
          .set({
            id: commentId,
            postId,
            reason: value,
            createdAt: +new Date()
          })
      }
      postItem?.createdBy?._id !== me?._id &&
        (await firebase
          .database()
          .ref(`notifications/${postItem?.createdBy?._id}/${+new Date()}`)
          .set({
            action: 'cmt',
            id: commentId,
            reciever: postItem?.createdBy?._id,
            link: `/post-detail/${postId}#${commentId}`,
            content: `${me?.firstname} đã bình luận bài viết của bạn`,
            seen: false,
            createdAt: +new Date()
          }))
    } catch (error) {
      console.log(error)
    }
  }
  // const history = useHistory()
  return (
    <div>
      <Comment
        className={`cmt-input ${props.idPost}`}
        avatar={<Avatar src={me?.avatar} alt="Han Solo" />}
        content={
          <InputCustomize
            idElement={props.idPost}
            onSubmit={isAuth ? handleSubmit : () => openLoginModal()}
            placeholder="Nhập bình luận"
            // value={value}
          />
        }
      />
      {comments?.length > 0 && (
        <CommentList
          setHashNoti={setHash}
          hashNoti={hash}
          showMore={showMore}
          idPost={props.idPost}
          comments={cmtNoti || comments}
        />
      )}
      {comments?.length > showMore && (
        <a
          onClick={() => {
            setShowMore(showMore + 2)
            setCmtNoti(null)
          }}
        >
          Xem thêm{' '}
        </a>
      )}
    </div>
  )
}
export default CommentPost
