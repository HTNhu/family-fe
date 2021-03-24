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
import * as firebase from 'firebase/app'

import DetailMemberReport from './detailMemberReport'
import gql from 'graphql-tag'
const DELETE_USER = gql`
  mutation deleteUser($userId: ID) {
    deleteUser(userId: $userId)
  }
`
function index() {
  const searchRef = useRef()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [dataUserReport, setDataUserReport] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)
  const [visible, setVisible] = useState(false)
  const [deleteUser] = useMutation(DELETE_USER)
  useEffect(() => {
    firebase
      .database()
      .ref(`reports/comments`)
      .on('value', snapshot => {
        const temp = Object.keys(snapshot.val()).map(key => {
          return {
            detail: Object.keys(snapshot.val()[key]).map(keyA => ({
              ...snapshot.val()[key][keyA],
              id: keyA
            })),
            id: key,
            count: Object.keys(snapshot.val()[key]).length
          }
        })
        setDataUserReport(temp)
      })
  }, [])
  const handleDeleteUser = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Xóa người dùng',
      content: 'Bạn có chắc chắn muốn xóa những người dùng này?',
      okText: 'Có',
      cancelText: 'Không',
      onCancel: () => setSelectedRowKeys([]),
      onOk: () => {
        selectedRowKeys.map(async id => {
          await deleteUser({
            variables: {
              userId: id
            }
          })
            .then(({ data }) => {
              if (data?.deleteUser) {
                firebase.database().ref(`reports/comments/${id}`).remove()
                dataUserReport
                  .filter(item => item.id === id)
                  .map(report => {
                    report.detail.repId
                      ? firebase
                          .database()
                          .ref(
                            `posts/${report.detail.postId}/comments/${report.detail.id}`
                          )
                          .remove()
                      : firebase
                          .database()
                          .ref(
                            `posts/${report.detail.postId}/comments/${report.detail.id}/replies/${report.detail.repId}`
                          )
                          .remove()
                  })
                notification.success({
                  message: 'Xóa người dùng thành công',
                  placement: 'bottomRight'
                })
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
            title: 'Mã người dùng',
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
        dataSource={dataUserReport}
        pagination={{ pageSize: 50 }}
        title={() => (
          <Row justify="end">
            <Space>
              <Tooltip title="Xóa người dùng" placement="bottom">
                <Button
                  disabled={selectedRowKeys.length <= 0}
                  danger
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteUser}
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
      <DetailMemberReport
        reasonsData={selectedRow}
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
