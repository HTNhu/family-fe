/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from 'react'
import { Input, Spin, Skeleton } from 'antd'

import { withRouter } from 'react-router-dom'
import { MainContext } from '../../layouts/MainLayout'
import './index.scss'
import {
  HighLightPost,
  PostHaveGroup,
  PostNoGroup,
  CreatePostDrawer
} from '@components'
import { IContext } from '@tools'
import { GET_POSTS } from '@shared'
import { useQuery } from '@apollo/react-hooks'

const HomePage = props => {
  const { history } = props
  const { isBroken } = useContext(MainContext)
  const [visibleModalCreate, setVisibleModalCreate] = useState(false)
  const { me, isAuth } = useContext(IContext)
  const [quantityPosts, setQuantityPosts] = useState(5)
  const handleCancel = () => {
    setVisibleModalCreate(false)
  }
  const {
    data: dataPosts,
    refetch: refetchPosts,
    loading,
    fetchMore
  } = useQuery(GET_POSTS, {
    variables: { quantity: 5 },
    fetchPolicy: 'no-cache'
  })
  const [loadMore, setLoadMore] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
  const [dataPostLoad, setDataPostLoad] = useState(dataPosts)
  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.scrollingElement.scrollHeight &&
      !isEnd
    ) {
      setLoadMore(true)

      document.documentElement.scrollTop = loadMore
        ? document.scrollingElement.scrollHeight
        : document.documentElement.scrollTop
    }
  }

  useEffect(() => {
    setDataPostLoad(dataPosts)
    if (dataPosts?.posts?.length < 5) {
      setIsEnd(true)
    }
  }, [dataPosts])
  useEffect(() => {
    if (loadMore) {
      setQuantityPosts(quantityPosts + 5)
    }
  }, [loadMore])
  useEffect(() => {
    fetchMoreListItems()
  }, [quantityPosts])
  const fetchMoreListItems = () => {
    fetchMore({
      query: GET_POSTS,
      variables: {
        quantity: quantityPosts
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        return Object.assign({}, prev, {
          posts: [...prev.posts, ...fetchMoreResult.posts]
        })
      }
    }).then(({ data }) => {
      if (data?.posts?.length + 5 < quantityPosts) {
        setLoadMore(false)
        setIsEnd(true)
      } else {
        setDataPostLoad(data)
        setLoadMore(false)
      }
    })
  }
  useEffect(() => {
    if (!isEnd) {
      window.addEventListener('scroll', handleScroll)
    }
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isEnd])

  return (
    <div id="list-posts">
      {isAuth && (
        <>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(0,0,0,0.6)',
              fontWeight: 'bold'
            }}
          >
            Tạo bài viết
          </p>
          <Input.TextArea
            onClick={() =>
              // isBroken
              //   ? history.push('/create-post')
              // :
              setVisibleModalCreate(!visibleModalCreate)
            }
            style={{
              margin: '0 auto',
              marginBottom: 15,
              resize: 'none',
              // background: rgb(0, 152, 218)',
              boxShadow: '0px 0px 5px #1f7fc8'
            }}
            placeholder={`${me?.firstname} ơi, hôm nay bạn cần chia sẻ gì ?`}
            // autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </>
      )}
      <p style={{ fontSize: 16, color: 'rgba(0,0,0,0.6)', fontWeight: 'bold' }}>
        Bài viết từ FAMILY
      </p>
      <HighLightPost history={history} isBroken={isBroken}></HighLightPost>

      {loading ? (
        <Skeleton active />
      ) : (
        dataPostLoad?.posts.map((item, idx) => {
          return item?.community ? (
            <PostHaveGroup
              isBroken={isBroken}
              history={history}
              refetch={refetchPosts}
              key={idx}
              item={item}
              idx={idx}
              dataPosts={dataPosts}
            ></PostHaveGroup>
          ) : (
            <PostNoGroup
              isBroken={isBroken}
              history={history}
              refetch={refetchPosts}
              key={idx}
              item={item}
              idx={idx}
              dataPosts={dataPosts}
            ></PostNoGroup>
          )
        })
      )}
      {loadMore && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Spin spinning />
        </div>
      )}
      <CreatePostDrawer
        refetch={refetchPosts}
        isBroken={isBroken}
        handleCancel={handleCancel}
        visible={visibleModalCreate}
      />
    </div>
  )
}

export default withRouter(HomePage)
