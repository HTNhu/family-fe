/* eslint-disable react/prop-types */
import React from 'react'
import { withRouter } from 'react-router-dom'
import { PostHaveGroup, PostNoGroup } from '@components'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { LeftSquareOutlined } from '@ant-design/icons'
import { Tooltip, Empty, Skeleton } from 'antd'
import { Helmet } from 'react-helmet'
export const GET_POST_BY_ID = gql`
  query postById($id: String) {
    postById(id: $id) {
      _id
      title
      content
      thumbnail
      keywords
      createdBy {
        _id
        firstname
        lastname
        avatar
        expert{
          isVerify
        }
      }
      createdAt
      community {
        _id
        name
        avatar
      }
    }
  }
`

function PostDetail(props) {
  const { postId } = props.match.params
  const { data, refetch, loading } = useQuery(GET_POST_BY_ID, {
    variables: { id: postId },
    fetchPolicy: 'no-cache',
    skip: !postId
  })
  const { hash } = props.history.location
const { history } = props
  const arrHash = hash.split('#')
  return loading ? (
    <Skeleton active avatar />
  ) : (
    <>
      <Helmet>
        <meta
          property="og:url"
          content={`window.location.origin/post-detail/${postId}`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={data?.postById?.title} />
        <meta
          property="og:description"
          content={`Bài viết được đăng bởi ${
            data?.postById?.createdBy?.firstname
          } - ${new Date(data?.postById?.createdAt).toLocaleString()}`}
        />
        <meta property="og:image" content={data?.postById?.thumbnail} />
        <meta charSet="utf-8" />
      </Helmet>
      <Tooltip title="Quay lại">
        <LeftSquareOutlined
          style={{ fontSize: 20 }}
          onClick={() => props.history.goBack()}
        />
      </Tooltip>
      {data?.postById ? (
        data?.postById?.community ? (
          <PostHaveGroup
            history={history}
            hashNoti={arrHash}
            refetch={refetch}
            key={0}
            item={data?.postById}
            idx={0}
            showText={true}
          ></PostHaveGroup>
        ) : (
          <PostNoGroup
            history={history}
            hashNoti={arrHash}
            refetch={refetch}
            key={0}
            item={data?.postById}
            idx={0}
            showText={true}
          ></PostNoGroup>
        )
      ) : (
        <div>
          <Empty description={'Bài đăng không còn khả dụng'} />
        </div>
      )}
    </>
  )
}

export default withRouter(PostDetail)
