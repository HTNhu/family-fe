import React, { useState, useRef } from 'react'
import { Table, Button, Space, Tooltip, Row, Modal, notification } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { getColumnSearchProps, notificationError } from '@shared'
import { PlusOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import ManageAdminForm from './manageAdminForm'

const GET_ADMINS = gql`
  query admins {
    admins {
      _id
      firstname
      lastname
      email
      gender
      phoneNumber
      birthday
      createdAt
    }
  }
`

const DELETE_ADMINS = gql`
  mutation deleteAdmins($ids: [ID]) {
    deleteAdmins(ids: $ids)
  }
`

function index() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)
  const searchRef = useRef()
  const formRef = useRef()
  const { loading, data, refetch } = useQuery(GET_ADMINS)
  const [deleteAdmins] = useMutation(DELETE_ADMINS)
  const handleDeleteAdmins = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Xóa cộng đồng',
      content: 'Bạn có chắc chắn muốn xóa những admin này?',
      okText: 'Có',
      cancelText: 'Không',
      onCancel: () => setSelectedRowKeys([]),
      onOk: () => {
        deleteAdmins({
          variables: {
            ids: selectedRowKeys
          }
        })
          .then(({ data }) => {
            if (data?.deleteAdmins) {
              notification.success({
                message: 'Xóa admin thành công',
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
    <div>
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
            title: 'Họ',
            dataIndex: 'lastname',
            key: 'lastname',
            ...getColumnSearchProps('lastname', searchRef)
          },
          {
            title: 'Tên',
            dataIndex: 'firstname',
            key: 'firstname',
            ...getColumnSearchProps('firstname', searchRef)
          },
          {
            title: 'Username',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email', searchRef),
            width: 150
          },
          {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            width: 50,
            render: gender =>
              gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : 'Khác'
          },
          {
            title: 'Ngày sinh',
            dataIndex: 'birthday',
            key: 'birthday',
            width: 120,
            render: birthday => new Date(birthday).toLocaleDateString()
          },
          {
            title: 'Số ĐT',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            ...getColumnSearchProps('phoneNumber', searchRef),
            width: 100
          },
          {
            title: 'Tạo lúc',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: createdAt => new Date(createdAt).toLocaleString('vn')
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
                    formRef.current?.openForm()
                  }}
                  type="primary"
                  icon={<EditOutlined />}
                />
              </Space>
            )
          }
        ]}
        dataSource={data?.admins}
        pagination={{ pageSize: 50 }}
        title={() => (
          <Row justify="end">
            <Space>
              <Tooltip title="Xóa admin" placement="bottom">
                <Button
                  disabled={selectedRowKeys.length <= 0}
                  danger
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteAdmins}
                />
              </Tooltip>
              <Tooltip title="Thêm admin" placement="bottom">
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setSelectedRow(null)
                    formRef.current?.openForm()
                  }}
                />
              </Tooltip>
            </Space>
          </Row>
        )}
      />
      <ManageAdminForm
        ref={formRef}
        dataAdmin={selectedRow}
        refetchAdmins={refetch}
      />
    </div>
  )
}

export default index
