import React, { useState, useContext, useEffect, useRef } from 'react'
import {
  Dropdown,
  Menu,
  notification,
  Modal,
  Drawer,
  Space,
  Button
} from 'antd'
import { ModalReport } from '@components'
import {
  EllipsisOutlined,
  FlagOutlined,
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { IContext } from '@tools'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  CHECK_IS_SAVED,
  CREATE_AND_DELETE_SAVEDPOST,
  notificationError
} from '@shared'
import gql from 'graphql-tag'
import EditPostForm from '../editPostForm'
import * as firebase from 'firebase/app'
export const DELETE_POST = gql`
  mutation deletePost($postId: String) {
    deletePost(postId: $postId)
  }
`
export const DELETE_SAVEPOSTS_BY_POST = gql`
  mutation deleteSavedPostsByPost($postId: String) {
    deleteSavedPostsByPost(postId: $postId)
  }
`
function SaveAndReport(props) {
  const formRef = useRef(null)
  const { me, isAuth, openLoginModal } = useContext(IContext)
  const [isSaved, setIsSaved] = useState(false)
  const [visibleModalReport, setVisibleModalReport] = useState(false)
  const { postId, postItem, refetch } = props
  const [createAndDelete] = useMutation(CREATE_AND_DELETE_SAVEDPOST)
  const [deletePost] = useMutation(DELETE_POST)
  const [deleteSavedPostsByPost] = useMutation(DELETE_SAVEPOSTS_BY_POST)
  const [showEditPost, setShowEditPost] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const onSaveClick = async () => {
    await createAndDelete({
      variables: {
        id: { userId: me?._id, postId }
      }
    }).then(async res => {
      notification.success({
        message: isSaved
          ? 'Hủy lưu bài viết thành công'
          : 'Lưu bài viết thành công'
      })
      await refetch()
      setIsSaved(!isSaved)
    })
    refetchSaved()
  }
  const onDeletePostClick = async () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Xóa bài viết',
      content: 'Bạn có chắc chắn muốn xóa bài viết này',
      okText: 'Có',
      cancelText: 'Không',
      // onCancel: () => setSelectedRowKeys([]),
      onOk: () => {
        deletePost({
          variables: {
            postId: postId
          }
        })
          .then(async ({ data }) => {
            if (data?.deletePost) {
              deleteSavedPostsByPost({ variables: { postId: postId } })
              firebase.database().ref(`posts/${postId}`).remove()
              postItem?.community?._id &&
            firebase
              .database()
              .ref(`communities/${postItem?.community?._id }/postsCount`)
              .once('value', snapshot => {
                firebase
                  .database()
                  .ref(`communities/${postItem?.community?._id }`)
                  .update({ postsCount: snapshot.val() - 1 })
              })

              await refetch()
              notification.success({ message: 'xóa bài viết thành công' })
            }
          })
          .catch(notificationError)
      }
    })
  }
  const openEdit = () => {
    setShowEditPost(true)
  }
  const menu =
    me?._id === postItem?.createdBy?._id ? (
      <Menu>
        <Menu.Item key="0">
          <div onClick={() => onDeletePostClick()}>
            <DeleteOutlined key="flag" /> Xóa bài viết
          </div>
        </Menu.Item>
        <Menu.Item key="1">
          <div onClick={() => openEdit()}>
            <EditOutlined key="flag" /> Chỉnh sửa bài viết
          </div>
        </Menu.Item>
      </Menu>
    ) : (
      <Menu>
        <Menu.Item key="0">
          <div
            onClick={() =>
              isAuth ? setVisibleModalReport(true) : openLoginModal()
            }
          >
            <FlagOutlined key="flag" /> Báo cáo bài viết
          </div>
        </Menu.Item>
        <Menu.Item key="1">
          <div
            onClick={async () =>
              isAuth ? await onSaveClick() : openLoginModal()
            }
          >
            <BookOutlined /> {isSaved ? 'Hủy lưu bài viết' : 'Lưu bài viết'}
          </div>
        </Menu.Item>
      </Menu>
    )
  const { data, refetch: refetchSaved } = useQuery(CHECK_IS_SAVED, {
    variables: { id: { userId: me?._id, postId } }
  })
  useEffect(() => {
    data && setIsSaved(data.checkIsSaved)
  }, [postId, data])

  const handleOk = () => {
    setVisibleModalReport(false)
  }
  const handleCancel = () => {
    setVisibleModalReport(false)
    setShowEditPost(false)
  }
  return (
    <>
      <Dropdown
        key="menu"
        overlay={menu}
        trigger={['click']}
        placement="bottomRight"
      >
        <EllipsisOutlined />
      </Dropdown>
      <ModalReport
        visible={visibleModalReport}
        handleCancel={handleCancel}
        handleOk={handleOk}
        postId={postId}
      ></ModalReport>
      {showEditPost && (
        <Drawer
          width="100%"
          closable={false}
          visible={showEditPost}
          title="Chỉnh sửa bài viết"
          footer={
            <Space style={{ float: 'right' }}>
              <Button onClick={() => setShowEditPost(false)}>Hủy</Button>
              <Button
                loading={confirmLoading}
                onClick={() => formRef?.current?.handleOk()}
                type="primary"
              >
                Lưu
              </Button>
            </Space>
          }
        >
          <div style={{ width: '80%', margin: '0 auto' }}>
            <EditPostForm
              refetch={refetch}
              setConfirmLoading={setConfirmLoading}
              ref={formRef}
              handleCancel={handleCancel}
              postItem={postItem}
            />
          </div>
        </Drawer>
      )}
    </>
  )
}
export default SaveAndReport
