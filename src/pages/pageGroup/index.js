/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from 'react'
import { Avatar, Input, Skeleton, Tooltip, Space } from 'antd'

import { withRouter } from 'react-router-dom'
import {
  ModalReport,
  PostNoGroup,
  JoinBtn,
  CreatePostDrawer,
  ModalPreviewImg
} from '@components'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { IContext } from '@tools'
import {
  GET_POST_BY_COMMUNITY,
  CHECK_IS_MEMBER,
  GET_MEMBERS_BY_COMMUNITY
} from '@shared'
import { MainContext } from '../../layouts/MainLayout'
import ReactionInfo from '../../components/post/reactionInfo'
import { LoadingOutlined } from '@ant-design/icons'
import * as firebase from 'firebase/app'
import ModalMemberInfo from './modalMemberInfo'
export const GET_COMMUNITY_BY_ID = gql`
  query communityById($id: String) {
    communityById(id: $id) {
      _id
      name
      avatar
      coverPhoto
    }
  }
`

function PageGroup(props) {
  const [visibleModalReport, setVisibleModalReport] = useState(false)
  const { communityId } = props.match.params
  const { me } = useContext(IContext)
  const { isBroken } = useContext(MainContext)
  const [visibleModalCreate, setVisibleModalCreate] = useState(false)
  const [visible, setVisible] = useState(false)
  
  const [previewImg, setPreviewImg] = useState({
    isShow: false,
    imgSrc: ''
  })
  const { data, refetch: refetchPostsByCom, loading: loađingPost } = useQuery(
    GET_POST_BY_COMMUNITY,
    {
      variables: { communityId },
      fetchPolicy: 'no-cache',
      skip: !communityId
    }
  )
  const { data: dataMems, loading: loadingMems } = useQuery(
    GET_MEMBERS_BY_COMMUNITY,
    {
      variables: { communityId },
      fetchPolicy: 'no-cache',
      skip: !communityId
    }
  )
  const { data: dataCommunity, refetch, loading } = useQuery(
    GET_COMMUNITY_BY_ID,
    {
      variables: { id: communityId },
      fetchPolicy: 'no-cache',
      skip: !communityId
    }
  )
  const { data: dataIsMember } = useQuery(CHECK_IS_MEMBER, {
    variables: { id: { userId: me?._id, communityId: communityId } }
  })
  const handleOk = () => {
    // setVisibleModalCreate(false)
    setVisibleModalReport(false)
  }
  const handleCancel = () => {
    setVisibleModalCreate(false)
    setVisibleModalReport(false)
  }
  const [dataCount, setDataCount] = useState([])
  useEffect(() => {
    firebase
      .database()
      .ref(`communities/${communityId}`)
      .on('value', snapshot => {
        const temp = snapshot.val()
        setDataCount(temp)
      })
  }, [])
  return loading ? (
    <Skeleton active />
  ) : (
    <>
      <div
        style={{
          height: 250,
          width: '100%',
          backgroundColor: 'rgba(255,255,255,0.9)'
        }}
        onClick={() => {
          setPreviewImg({
            isShow: true,
            imgSrc: dataCommunity?.communityById?.coverPhoto
          })
        }}
      >
        <img
          className="cover-img"
          style={{ objectFit: 'cover', height: 250, width: '100%' }}
          alt="example"
          src={dataCommunity?.communityById?.coverPhoto}
        />
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: -60,
          backgroundColor: 'rgba(255,255,255,0.6)'
        }}
      >
        <Avatar
          onClick={() => {
            setPreviewImg({
              isShow: true,
              imgSrc: dataCommunity?.communityById?.avatar
            })
          }}
          style={{ border: '2px solid rgba(0,0,0,0.5)', marginLeft: 10 }}
          shape="square"
          size={120}
          src={dataCommunity?.communityById?.avatar}
        />
        <div style={{ marginLeft: 10 }}>
          <p
            style={{
              fontWeight: 'bolder',
              fontSize: 20,
              color: '#fff',
              textShadow: '0px 2px 2px rgba(0, 0, 0, 0.8)'
            }}
          >
            {dataCommunity?.communityById?.name}
          </p>
          <div
            style={{
              marginTop: -15,
              fontWeight: 'bolder',
              color: '#fff',
              fontSize: 12,
              textShadow: '0px 2px 2px rgba(0, 0, 0, 0.8)'
            }}
          >
            {' '}
            <Space>
              <Tooltip
                title={loadingMems ? <LoadingOutlined /> :
                  <div>
                    {dataMems?.getMembersByCommunity?.slice(0, 5).map(data => {
                      return (
                        <ReactionInfo
                          type='tooltip'
                          isBroken={isBroken}
                          key={data?.user?._id}
                          userId={data?.user?._id}
                        />
                      )
                    })}
                    {dataMems?.getMembersByCommunity?.length > 5 && (
                      <p>{`...và ${
                        dataMems?.getMembersByCommunity?.length - 5
                      } nguời khác`}</p>
                    )}
                  </div>
                }
              >
                <p onClick={() => setVisible(true)}>{dataCount?.membersCount} thành viên </p>
              </Tooltip>
              <p>- {dataCount?.postsCount} bài viết</p>
            </Space>
          </div>
          <JoinBtn
            id={{ userId: me?._id, communityId: communityId }}
            history={props.history}
            refetchDataMemberCount={refetch}
          ></JoinBtn>
        </div>
      </div>
      <br />
      {dataIsMember?.checkIsMember && (
        <Input.TextArea
          onClick={() => setVisibleModalCreate(!visibleModalCreate)}
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
        // </>
      )}
      {loađingPost ? (
        <Skeleton active avatar />
      ) : (
        data &&
        data?.postsByCommunity.map((item, idx) => {
          return (
            <PostNoGroup
              refetch={refetchPostsByCom}
              key={idx}
              item={item}
              idx={idx}
            ></PostNoGroup>
          )
        })
      )}
      <ModalPreviewImg
        previewImg={previewImg}
        onCancel={() => setPreviewImg({ ...previewImg, isShow: false })}
      />
      <ModalReport
        visible={visibleModalReport}
        handleCancel={handleCancel}
        handleOk={handleOk}
        isBroken={isBroken}
      ></ModalReport>
      <CreatePostDrawer
        refetch={refetchPostsByCom}
        data={dataCommunity?.communityById}
        isBroken={isBroken}
        handleCancel={handleCancel}
        visible={visibleModalCreate}
      />
      <ModalMemberInfo isBroken={isBroken} visible={visible} setVisible={setVisible} members={dataMems?.getMembersByCommunity} />
    </>
  )
}

export default withRouter(PageGroup)
