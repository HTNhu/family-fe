import React, { useState, useLayoutEffect } from 'react'
import { Form, Input, Upload, Button, Space, Drawer, notification } from 'antd'
import { UploadButton } from '@components'
import { uploadImg, beforeUpload, notificationError } from '@shared'
import { PlusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import * as firebase from 'firebase/app'
const CREATE_COMMUNITY = gql`
  mutation createCommunity($newCommunity: NewCommunity) {
    createCommunity(newCommunity: $newCommunity)
  }
`

const UPDATE_COMMUNITY = gql`
  mutation updateCommunity($_id: ID!, $newCommunity: NewCommunity) {
    updateCommunity(_id: $_id, newCommunity: $newCommunity)
  }
`

const CreateCommunityForm = ({
  communityData,
  visible,
  onClose,
  refetchCommunities
}) => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(communityData?.avatar)
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(communityData?.coverPhoto)
  const [loadingCoverPhoto, setLoadingCoverPhoto] = useState(false)

  useLayoutEffect(() => {
    setImageUrl(communityData?.avatar)
    setCoverPhotoUrl(communityData?.coverPhoto)
  }, [communityData])

  const [form] = Form.useForm()

  const [createCommunity] = useMutation(CREATE_COMMUNITY)
  const [updateCommunity] = useMutation(UPDATE_COMMUNITY)

  const handleUpload = async file => {
    setLoading(true)
    uploadImg(file).then(url => {
      setImageUrl(url)
      setLoading(false)
    })
  }
  const handleUploadCoverPhoto = async file => {
    setLoadingCoverPhoto(true)
    uploadImg(file).then(url => {
      setCoverPhotoUrl(url)
      setLoadingCoverPhoto(false)
    })
  }

  const handleCreateCommunity = ({ name }) => {
    if (communityData) {
      updateCommunity({
        variables: {
          _id: communityData?._id,
          newCommunity: {
            name: name.trim(),
            avatar: imageUrl,
            coverPhoto: coverPhotoUrl
          }
        }
      })
        .then(({ data }) => {
          if (data?.updateCommunity) {
            notification.success({ message: 'Cập nhật cộng đồng thành công', placement: 'bottomRight' })
            refetchCommunities()
            onClose()
          }
        })
        .catch(notificationError)
    } else {
      createCommunity({
        variables: {
          newCommunity: {
            name: name.trim(),
            avatar: imageUrl,
            coverPhoto: coverPhotoUrl
          }
        }
      })
        .then(({ data }) => {
          if (data?.createCommunity) {
            firebase.database().ref(`communities/${data?.createCommunity}`).set({
              membersCount: 0,
              postsCount: 0
            })
            notification.success({ message: 'Thêm cộng đồng mới thành công', placement: 'bottomRight' })
            refetchCommunities()
            onClose()
          }
        })
        .then(notificationError)
    }
  }

  return (
    <Drawer
      title={communityData ? 'Cập nhật cộng đồng' : "Cộng đồng mới"}
      visible={visible}
      onClose={onClose}
      closable={false}
      afterVisibleChange={visible => {
        if (!visible) {
          setCoverPhotoUrl(null)
          setImageUrl(null)
          setLoading(false)
          setLoadingCoverPhoto(false)
        }
        form.resetFields()
      }}
      width="50%"
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={() => form.submit()} type="primary">
            {communityData ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        initialValues={{ name: communityData?.name }}
        layout="vertical"
        onFinish={handleCreateCommunity}
      >
        <Form.Item
          label="Tên cộng đồng"
          name="name"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên cộng đồng'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Avatar">
          <Space>
            <Upload
              action={handleUpload}
              listType="picture-card"
              beforeUpload={beforeUpload}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                <UploadButton loading={loading} />
              )}
            </Upload>
            {imageUrl && (
              <Button danger onClick={() => setImageUrl(null)}>
                Xóa ảnh
              </Button>
            )}
          </Space>
        </Form.Item>
        <Form.Item label="Ảnh bìa">
          <Space>
            <Upload
              action={handleUploadCoverPhoto}
              listType="picture"
              beforeUpload={beforeUpload}
            >
              {coverPhotoUrl ? (
                <img
                  src={coverPhotoUrl}
                  alt="avatar"
                  style={{
                    objectFit: 'fill',
                    width: '100%',
                    height: 200,
                    boxShadow:
                      '0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset'
                  }}
                />
              ) : (
                <Button
                  loading={loadingCoverPhoto}
                  type="dashed"
                  icon={<PlusOutlined />}
                >
                  Upload
                </Button>
              )}
            </Upload>
            {coverPhotoUrl && (
              <Button danger onClick={() => setCoverPhotoUrl(null)}>
                Xóa ảnh
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default CreateCommunityForm
