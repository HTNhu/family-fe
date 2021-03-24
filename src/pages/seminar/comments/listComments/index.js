import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Comment, List } from 'antd'
import * as firebase from 'firebase/app'
import moment from 'moment'

const ListComments = ({ idSeminar, onScrollEnd }) => {
  const [comment, setComment] = useState(null)
  const [comments, setComments] = useState([])
  useEffect(() => {
    firebase
      .database()
      .ref(`seminars/${idSeminar}/comments`)
      .on('child_added', snapshot => {
        if (snapshot.val()) {
          setComment(snapshot.val())
        }
      })
  }, [])
  useLayoutEffect(() => {
    if (comment) {
      setComments([...comments, comment])
      onScrollEnd()
    }
  }, [comment])
  return (
    <List
      dataSource={comments}
      itemLayout="horizontal"
      renderItem={props => (
        <Comment
          style={{ margin: '0 10px' }}
          {...props}
          datetime={moment(props?.createdAt).fromNow()}
        />
      )}
    />
  )
}

export default ListComments
