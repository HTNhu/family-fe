/* eslint-disable react/display-name */
import React, { useContext, useState, useRef } from 'react'
import {
  Button,
  Table,
  Space,
  Row,
  Tooltip,
  Avatar,
  Modal,
  notification
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PlusOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { IContext } from '@tools'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import CreateCommunityForm from './createCommunityForm'
import { notificationError, getColumnSearchProps } from '@shared'

const GET_COMMUNITIES = gql`
  query communities {
    communities {
      _id
      name
      avatar
      coverPhoto
      createdAt
      createdBy {
        firstname
        lastname
      }
    }
  }
`

const DELETE_COMMUNITIES = gql`
  mutation deleteCommunities($ids: [ID]) {
    deleteCommunities(ids: $ids)
  }
`

function index() {
  const { history } = useContext(IContext)
  const searchRef = useRef()

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)
  const [visible, setVisible] = useState(false)

  const { data, loading, refetch } = useQuery(GET_COMMUNITIES)
  const [deleteCommunities] = useMutation(DELETE_COMMUNITIES)

  const handleDeleteCommunities = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Xóa cộng đồng',
      content: 'Bạn có chắc chắn muốn xóa những cộng đồng này?',
      okText: 'Có',
      cancelText: 'Không',
      onCancel: () => setSelectedRowKeys([]),
      onOk: () => {
        deleteCommunities({
          variables: {
            ids: selectedRowKeys
          }
        })
          .then(({ data }) => {
            if (data?.deleteCommunities) {
              notification.success({
                message: 'Xóa cộng đồng thành công',
                placement: 'bottomRight'
              })
              refetch()
            }
          })
          .catch(notificationError)
      }
    })
  }

  return (
    <>
      <Table
        style={{ height: 'calc(100vh - 103px)' }}
        rowKey="_id"
        loading={loading}
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
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
              <Button
                type="link"
                onClick={() =>
                  history.push(
                    `${window.location.origin}/community/${record._id}`
                  )
                }
              >
                {text}
              </Button>
            ),
            ...getColumnSearchProps('name', searchRef)
          },
          {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 100,
            render: avatarUrl => (
              <Avatar
                shape="square"
                size="large"
                src={avatarUrl}
                icon={<UserOutlined />}
              />
            )
          },
          {
            title: 'Ảnh bìa',
            dataIndex: 'coverPhoto',
            key: 'coverPhoto',
            width: 250,
            render: coverPhotoUrl => (
              <img
                src={coverPhotoUrl}
                style={{ objectFit: 'fill', width: 200, height: 70 }}
              />
            )
          },
          {
            title: 'Tạo lúc',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: createdAt => new Date(createdAt).toLocaleString('vn')
          },
          {
            title: 'Tạo bởi',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 150,
            render: createdBy =>
              `${createdBy?.firstname} ${createdBy?.lastname}`
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
                  icon={<EditOutlined />}
                />
              </Space>
            )
          }
        ]}
        dataSource={data?.communities}
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
                  onClick={handleDeleteCommunities}
                />
              </Tooltip>
              <Tooltip title="Thêm cộng đồng" placement="bottom">
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={() => setVisible(true)}
                />
              </Tooltip>
            </Space>
          </Row>
        )}
      />
      <CreateCommunityForm
        communityData={selectedRow}
        visible={visible}
        onClose={() => {
          setVisible(false)
          setSelectedRow(null)
        }}
        refetchCommunities={refetch}
      />
    </>
  )
}

export default index
