/* eslint-disable react/prop-types */
import React, { useContext } from 'react'

import { withRouter } from 'react-router-dom'
// import Reaction from '../../../components/reaction'
import { IContext } from '@tools'
import { PostHaveGroup, PostNoGroup } from '@components'
import { GET_SAVEDPOST_BY_USER } from '@shared'
import { useQuery } from '@apollo/react-hooks'
import { Skeleton } from 'antd'

function SavedPosts(props) {
  const { history } = props
  const { me } = useContext(IContext)
  const { data: dataSavedPost, refetch: refetchSavedPost, loading } = useQuery(
    GET_SAVEDPOST_BY_USER,
    {
      variables: { userId: me?._id },
      fetchPolicy: 'no-cache'
    }
  )
  return (
    <>
      {loading ? (
        <Skeleton active />
      ) : (
        dataSavedPost?.getSavedPostByUser?.reverse().map((item, idx) => {
          return item?.post?.community ? (
            <PostHaveGroup
              history={history}
              refetch={refetchSavedPost}
              key={idx}
              item={item.post}
              idx={idx}
            ></PostHaveGroup>
          ) : (
            <PostNoGroup
              history={history}
              refetch={refetchSavedPost}
              key={idx}
              item={item.post}
              idx={idx}
            ></PostNoGroup>
          )
        })
      )}
    </>
  )
}

export default withRouter(SavedPosts)
