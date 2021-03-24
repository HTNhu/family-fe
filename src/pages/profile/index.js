/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect } from 'react'
import {
  Avatar,
  Button,
  Upload,
  notification,
  List,
  Spin,
  Skeleton,
  Empty
} from 'antd'
import { withRouter } from 'react-router-dom'
import {
  CameraFilled,
  CheckCircleTwoTone,
  CloseCircleTwoTone
} from '@ant-design/icons'

import Info from './info'
import MyMessenger from '@pages/myMessenger'
import MyPosts from './myPosts'
import SavedPosts from './savedPosts'
import { ModalPreviewImg, Chat, Follow, CommunityItem } from '@components'
import { MainContext } from '../../layouts/MainLayout'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  GET_USER,
  UPDATE_USER,
  uploadImg,
  GET_COMMUNITIES_BY_USER
} from '@shared'
import './index.scss'
import { IContext } from '@tools'
import * as firebase from 'firebase/app'
import ImgCrop from 'antd-img-crop'
import gql from 'graphql-tag'
import MenuInfo from './menuInfo'
export const GET_SUM_FOLLOWER_BY_USER = gql`
  query getFollowerByUser($userId: String) {
    getFollowerByUser(userId: $userId) {
      _id {
        userId
      }
      follower {
        _id
        firstname
        lastname
      }
    }
  }
`

function Profile(props) {
  const { history } = props
  const { type, userId } = props.match.params
  const [dataCount, setDataCount] = useState([])
  const { isBroken, chooseConversation } = useContext(MainContext)
  const { data, refetch, loading } = useQuery(GET_USER, {
    variables: { userId: userId }
  })
  const { data: dataCountFollow, refetch: refetchDataCountFollow } = useQuery(
    GET_SUM_FOLLOWER_BY_USER,
    {
      variables: { userId: userId }
    }
  )
  const [previewImg, setPreviewImg] = useState({
    isShow: false,
    imgSrc: ''
  })
  const { me, refetchMe } = useContext(IContext)
  const isMe = userId === me?._id
  const [loadingImg, setLoadingImg] = useState({
    coverPhoto: false,
    avatar: false
  })
  const [img, setImg] = useState({
    coverPhoto: null,
    avatar: null
  })
  const [updateUser] = useMutation(UPDATE_USER)
  const { data: dataCommunity, loading: loadingJoined } = useQuery(
    GET_COMMUNITIES_BY_USER,
    {
      variables: { userId: me?._id },
      fetchPolicy: 'no-cache'
    }
  )
  useEffect(() => {
    dataCommunity && getCount()
  }, [dataCommunity])
  const getCount = () => {
    dataCommunity?.getCommunitiesByUser?.map(item => {
      firebase
        .database()
        .ref(`communities/${item?.community?._id}`)
        .on('value', snapshot => {
          const temp = [
            ...dataCount,
            { ...snapshot.val(), id: item?.community?._id }
          ]
          setDataCount(temp)
        })
    })
  }
  const uploadButtonCover =
    isMe &&
    (!img.coverPhoto ? (
      <div
        className="btn-saveCover"
        style={{
          // border: '1px solid #fff',
          backgroundColor: 'rgba(0,0,0,0.3)',
          position: 'absolute',
          top: '5px',
          left: '5px'
        }}
      >
        <Upload
          name="cover"
          listType="picture-card"
          className="icon-uploader"
          showUploadList={false}
          action={file => handleChangeCover(file)}
          beforeUpload={beforeUpload}
          // onChange={info => handleChangeCover(info)}
        >
          <CameraFilled style={{ fontSize: 25, color: '#fff' }} />
        </Upload>
      </div>
    ) : (
      <div
        className="btn-saveCover"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)'
        }}
      >
        <Button
          style={{ marginRight: 15, padding: '0 20px' }}
          type="primary"
          onClick={() => handleSubmitUpload('coverPhoto')}
        >
          Lưu
        </Button>
        <Button
          type="ghost"
          style={{ padding: '0 20px' }}
          onClick={() => handleCancel()}
        >
          {' '}
          Hủy
        </Button>
      </div>
    ))

  const uploadButtonAvt =
    isMe &&
    (!img?.avatar ? (
      <div
        className="avatar-uploader"
        style={{ position: 'absolute', bottom: 5, right: 5 }}
      >
        <ImgCrop rotate shape="round">
          <Upload
            name="avatar"
            listType="picture-card"
            className="icon-avt-uploader"
            showUploadList={false}
            action={file => handleChangeAvatar(file)}
            beforeUpload={beforeUpload}
            // onChange={info => handleChangeAvatar(info)}
          >
            <CameraFilled style={{ fontSize: 23 }} />
          </Upload>
        </ImgCrop>
      </div>
    ) : (
      <div
        className="btn-saveAvt"
        style={{
          fontSize: 25,
          borderRadius: '50%',
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.2)'
        }}
      >
        <CheckCircleTwoTone
          twoToneColor="#52c41a"
          style={{ marginRight: 10 }}
          onClick={() => handleSubmitUpload('avatar')}
        />
        <CloseCircleTwoTone twoToneColor="red" onClick={() => handleCancel()} />
      </div>
    ))
  const handleChangeAvatar = async file => {
    setLoadingImg({ coverPhoto: false, avatar: true })
    uploadImg(file).then(url => {
      setImg({
        coverPhoto: null,
        avatar: url
      })
      setLoadingImg({ ...loadingImg, avatar: false })
    })
  }
  const handleChangeCover = file => {
    setLoadingImg({ avatar: false, coverPhoto: true })
    uploadImg(file).then(url => {
      setImg({
        avatar: null,
        coverPhoto: url
      })
      setLoadingImg({ ...loadingImg, coverPhoto: false })
    })
  }
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      notification.error({ message: 'You can only upload JPG/PNG file!' })
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      notification.error({ message: 'Image must smaller than 2MB!' })
    }
    return isJpgOrPng && isLt2M
  }

  const handleSubmitUpload = async type => {
    await updateUser({
      variables: {
        userId: userId,
        editUser: {
          coverPhoto:
            type === 'coverPhoto' ? img?.coverPhoto : data?.getUser?.coverPhoto,
          avatar: type === 'avatar' ? img?.avatar : data?.getUser?.avatar
        }
      }
    })
    setImg({
      coverPhoto: null,
      avatar: null
    })
    await refetch()
    refetchMe()
    notification.success({
      message: `Thay ảnh ${type === 'avatar' ? 'đại diện' : 'bìa'} thành công`
    })
  }
  const handleCancel = () => {
    setLoadingImg({
      avatar: false,
      coverPhoto: false
    })
    setImg({
      avatar: null,
      coverPhoto: null
    })
  }
  return loading ? (
    <Skeleton active avatar />
  ) : data?.getUser ? (
    <>
      <div>
        <div>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '250px',
              backgroundColor: '#ccc'
            }}
          >
            {(img.coverPhoto || data?.getUser.coverPhoto) && (
              <img
                onClick={() => {
                  setPreviewImg({
                    isShow: true,
                    imgSrc: img.coverPhoto || data?.getUser.coverPhoto
                  })
                }}
                className="cover-img"
                style={{ objectFit: 'cover', height: 250, width: '100%' }}
                // alt='example'
                src={img.coverPhoto || data?.getUser.coverPhoto}
              />
            )}
            {/* {loadingImg.coverPhoto && ( */}
            {img.coverPhoto && (
              <div
                className="btn-saveCover"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: loadingImg.coverPhoto && 'rgba(0,0,0,0.7)'
                }}
              >
                {/* <LoadingOutlined
                    style={{
                      fontSize: 30,
                      color: '#fff'
                    }}
                  /> */}
                <Spin spinning={loadingImg.coverPhoto} size="large" />
              </div>
            )}
            {/* )} */}
            {uploadButtonCover}
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.7)',
            width: '100%',
            display: 'flex',
            marginTop: -95,
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', width: '100%' }}>
            <div
              style={{
                position: 'relative',
                width: 130,
                height: 130,
                marginRight: 30
              }}
            >
              {(data?.getUser?.avatar || img?.avatar) && (
                <Avatar
                  onClick={() => {
                    setPreviewImg({
                      isShow: true,
                      imgSrc: img?.avatar || data?.getUser?.avatar
                    })
                  }}
                  className="img-avt"
                  style={{ border: '2px solid black', objectFit: 'cover' }}
                  shape="circle"
                  size={130}
                  src={img?.avatar || data?.getUser?.avatar}
                />
              )}
              {/* {loadingImg.avatar && ( */}
              {img.avatar && (
                <div
                  className="btn-saveAvt"
                  style={{
                    fontSize: 25,
                    borderRadius: '50%',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: loadingImg.avatar && 'rgba(0,0,0,0.6)'
                  }}
                >
                  {/* <LoadingOutlined
                      style={{
                        fontSize: 30,
                        color: '#fff'
                      }}
                    /> */}
                  <Spin spinning={loadingImg.avatar} />
                </div>
              )}
              {uploadButtonAvt}
              {/* )} */}
            </div>
            <div style={{ marginTop: 100, marginBottom: 0, width: '90%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: isBroken ? 'flex-start' : 'space-between'
                }}
              >
                <p
                  style={{
                    fontWeight: 'bolder',
                    fontSize: 20,
                    color: 'black',
                    textShadow: '0px 2px 2px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {`${data?.getUser.firstname} ${data?.getUser.lastname}`}{' '}
                  {data?.getUser?.expert?.isVerify && <CheckCircleTwoTone />}
                </p>
                <div>
                  {!isMe && (
                    <div>
                      <Follow
                        refetchDataCountFollow={refetchDataCountFollow}
                        follower={{ userId: userId, followerId: me?._id }}
                      />
                      <Chat
                        chooseConversation={(idChat, userId) =>
                          chooseConversation(idChat, userId)
                        }
                        members={[me?._id, userId]}
                        history={history}
                        isBroken={isBroken}
                      ></Chat>
                    </div>
                  )}
                </div>
              </div>
              {isMe && (
                <MenuInfo
                  isBroken={isBroken}
                  userId={userId}
                  type={type}
                  isMe={isMe}
                  history={history}
                />
              )}
            </div>
          </div>
        </div>
        <br />{' '}
      </div>
      <div
        style={{
          backgroundColor:
            type === 'info' ? 'rgba(255,255,255,0.7)' : 'aliceblue',
          padding: type === 'info' && 16
        }}
      >
        {type === 'info' && (
          <Info
            isBroken={isBroken}
            userInfo={data?.getUser}
            isMe={isMe}
            dataCountFollow={dataCountFollow}
          />
        )}
        {/* {type === 'messenger' && <MyMessenger userInfo={data?.getUser} />} */}
        {type === 'myposts' && (
          <MyPosts history={history} userInfo={data?.getUser} />
        )}
        {type === 'savedposts' && (
          <SavedPosts history={history} userInfo={data?.getUser} />
        )}
        {type === 'joinedGroup' &&
          (loadingJoined ? (
            <Skeleton active />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={dataCount}
              renderItem={item => (
                <CommunityItem
                  item={item}
                  // data={dataCommunity?.getCommunitiesByUser}
                />
              )}
            />
          ))}
      </div>
      <ModalPreviewImg
        previewImg={previewImg}
        onCancel={() => setPreviewImg({ ...previewImg, isShow: false })}
      />
    </>
  ) : (
    <Empty description="Không còn khả dụng" />
  )
}

export default withRouter(Profile)
