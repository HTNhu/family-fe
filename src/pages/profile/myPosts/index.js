/* eslint-disable react/prop-types */
import React, { useState, useContext } from 'react'

import {
  ModalReport,
  PostNoGroup,
  PostHaveGroup,
  CreatePostDrawer
  // ModalCreatePost
} from '../../../components'
import { IContext } from '@tools'
import { GET_POSTS_BY_USER } from '@shared'
import { useQuery } from '@apollo/react-hooks'
import { Input, Skeleton } from 'antd'
import { MainContext } from '../../../layouts/MainLayout'

function MyPosts(props) {
  const [visibleModalReport, setVisibleModalReport] = useState(false)
  const { me } = useContext(IContext)
  const [visibleModalCreate, setVisibleModalCreate] = useState(false)
  const { isBroken } = useContext(MainContext)
  const { history } = props
  const { data: dataMyPosts, refetch: refetchMyPosts, loading } = useQuery(
    GET_POSTS_BY_USER,
    {
      variables: { userId: me?._id },
      fetchPolicy: 'no-cache',
      skip: !me?._id
    }
  )
  const handleOk = () => {
    // setVisibleModalCreate(false)
    setVisibleModalReport(false)
  }
  const handleCancel = () => {
    setVisibleModalCreate(false)
    setVisibleModalReport(false)
  }

  return (
    <>
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
      {loading ? (
        <Skeleton active />
      ) : (
        dataMyPosts &&
        dataMyPosts?.postsByUser.map((item, idx) =>
          item?.community ? (
            <PostHaveGroup
              history={history}
              refetch={refetchMyPosts}
              key={idx}
              item={item}
              idx={idx}
            ></PostHaveGroup>
          ) : (
            <PostNoGroup
              history={history}
              refetch={refetchMyPosts}
              key={idx}
              item={item}
              idx={idx}
            ></PostNoGroup>
          )
        )
      )}

      <ModalReport
        isBroken={isBroken}
        visible={visibleModalReport}
        handleCancel={handleCancel}
        handleOk={handleOk}
      ></ModalReport>
      <CreatePostDrawer
        data={null}
        refetch={refetchMyPosts}
        isBroken={isBroken}
        handleCancel={handleCancel}
        visible={visibleModalCreate}
      />
    </>
  )
}

export default MyPosts
