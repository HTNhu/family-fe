/* eslint-disable react/display-name */
import React, { useState, useRef, useEffect } from 'react'
import { Button, Table, Space, Row, Tooltip, Modal, notification } from 'antd'
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeFilled
} from '@ant-design/icons'
import { useMutation } from '@apollo/react-hooks'
// import CreateCommunityForm from './createCommunityForm'
import { notificationError, getColumnSearchProps } from '@shared'
import gql from 'graphql-tag'
import * as firebase from 'firebase/app'
import DetailReport from './detailReport'
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

function index() {
  const searchRef = useRef()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [data, setData] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)
  const [visible, setVisible] = useState(false)

  const [deletePost] = useMutation(DELETE_POST)
  const [deleteSavedPostsByPost] = useMutation(DELETE_SAVEPOSTS_BY_POST)
  useEffect(() => {
    firebase
      .database()
      .ref(`reports/posts`)
      .on('value', snapshot => {
        const temp = snapshot.val()
          ? Object.keys(snapshot.val()).map(key => {
              return {
                detail: Object.keys(snapshot.val()[key]).map(keyA => ({
                  ...snapshot.val()[key][keyA],
                  id: keyA
                })),
                id: key,
                count: Object.keys(snapshot.val()[key]).length
              }
            })
          : []
        setData(temp.sort((a, b) => b.count - a.count))
      })
  }, [setSelectedRowKeys])
  const handleDeletePost = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Xóa bài viết',
      content: 'Bạn có chắc chắn muốn xóa những bài viết này?',
      okText: 'Có',
      cancelText: 'Không',
      onCancel: () => setSelectedRowKeys([]),
      onOk: () => {
        selectedRowKeys.map(id => {
          deletePost({
            variables: {
              postId: id
            }
          })
            .then(({ data }) => {
              if (data?.deletePost) {
                notification.success({
                  message: 'Xóa bài viết thành công',
                  placement: 'bottomRight'
                })
                firebase.database().ref(`posts/${id}}`).remove()
                deleteSavedPostsByPost({ variables: { postId: id } })
                firebase.database().ref(`reports/posts/${id}`).remove()
              }
            })
            .catch(notificationError)
        })
      }
    })
  }

  return (
    <>
      <Table
        style={{ height: 'calc(100vh - 103px)' }}
        rowKey="id"
        bordered
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: selectedRowKeys => {
            setSelectedRowKeys(selectedRowKeys)
          }
        }}
        columns={[
          {
            title: 'Mã bài viết',
            dataIndex: 'id',
            key: 'id',
            width: 300,
            render: (text, record) => <Button type="link">{text}</Button>,
            ...getColumnSearchProps('name', searchRef)
          },
          {
            title: 'Số lần report',
            dataIndex: 'count',
            key: 'count',
            width: 100,
            render: (text, record) => (
              <div
                style={{
                  width: 70,
                  // margin: '0 auto',
                  backgroundColor: 'rgba(223, 9, 9 , 0.8)',
                  color: '#fff',
                  fontWeight: 'bolder',
                  textAlign: 'center'
                }}
              >
                {text}
              </div>
              // <Avatar
              //   shape="square"
              //   size="large"
              //   src={avatarUrl}
              //   icon={<UserOutlined />}
              // />
            )
          },
          {
            title: 'Action',
            key: 'action',
            width: 75,
            render: (_, record) => (
              <Space size="middle">
                <Button
                  onClick={() => {
                    setSelectedRow(record)
                    setVisible(true)
                  }}
                  type="primary"
                  icon={<EyeFilled />}
                />
              </Space>
            )
          }
        ]}
        dataSource={data}
        pagination={{ pageSize: 50 }}
        title={() => (
          <Row justify="end">
            <Space>
              <Tooltip title="Xóa cộng đồng" placement="bottom">
                <Button
                  disabled={selectedRowKeys.length <= 0}
                  danger
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={handleDeletePost}
                />
              </Tooltip>
              {/* <Tooltip title="Thêm cộng đồng" placement="bottom">
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={() => setVisible(true)}
                />
              </Tooltip> */}
            </Space>
          </Row>
        )}
      />
      <DetailReport
        postData={selectedRow}
        visible={visible}
        onClose={() => {
          setVisible(false)
          setSelectedRow(null)
        }}
        setSelectedRowKeys={setSelectedRowKeys}
        selectedRowKeys={selectedRowKeys}
      />
    </>
  )
}

export default index
