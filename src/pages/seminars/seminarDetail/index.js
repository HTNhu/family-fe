import React, { useMemo } from 'react'
import {
  Card,
  Space,
  Button,
  Dropdown,
  Menu,
  Avatar,
  notification,
  Modal
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  UserOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import gql from 'graphql-tag'
import * as firebase from 'firebase/app'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { notificationError } from '@shared'
const GET_FOLLOWER_BY_USER = gql`
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

const DELETE_SEMINAR = gql`
  mutation deleteSeminar($_id: ID) {
    deleteSeminar(_id: $_id)
  }
`

function SeminarDetail({ me, seminarData, state, openEditModal, refetch }) {
  const { data: dataFollow } = useQuery(GET_FOLLOWER_BY_USER, {
    variables: { userId: seminarData?.createdBy?._id },
    fetchPolicy: 'no-cache'
  })
  const [deleteSeminar] = useMutation(DELETE_SEMINAR)
  const notifyToUser = item => {
    try {
      item?._id !== seminarData?.createdBy?._id &&
        firebase
          .database()
          .ref(`notifications/${item?._id}/${+new Date()}`)
          .set({
            action: 'seminar',
            reciever: item?._id,
            link: `${window.origin}/seminar/${seminarData?._id}`,
            content: `${seminarData?.createdBy?.expert?.jobTitle} ${seminarData?.createdBy?.firstname} đang phát trực tiếp hội thảo ${seminarData?.title}. Tham gia ngay nào`,
            seen: false,
            createdAt: +new Date()
          })
    } catch (err) {
      console.log(err)
    }
  }
  const deleteSeminarById = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Xóa hội thảo',
      content: 'Bạn có chắc chắn muốn xóa hội thảo này',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        deleteSeminar({
          variables: {
            _id: seminarData?._id
          }
        })
          .then(() => {
            refetch()
            notification.success({
              message: 'Xóa hội thảo thành công',
              placement: 'bottomRight'
            })
          })
          .catch(notificationError)
      }
    })
  }
  const extra = useMemo(() => {
    switch (state) {
      case 'upcoming': {
        if (me?._id === seminarData?.createdBy?._id) {
          return (
            <Space>
              <Button
                onClick={() => {
                  dataFollow?.getFollowerByUser?.map(item => {
                    notifyToUser(item.follower)
                  })
                  window.open(`${window.origin}/seminar/${seminarData._id}`)
                }}
                key="start"
                type="primary"
              >
                Bắt đầu
              </Button>
              <Dropdown
                placement="bottomCenter"
                overlay={
                  <Menu>
                    <Menu.Item onClick={openEditModal} key="0">
                      <EditOutlined />
                      <span>Sửa</span>
                    </Menu.Item>
                    <Menu.Item onClick={deleteSeminarById} key="1">
                      <DeleteOutlined />
                      <span>Xóa</span>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button icon={<MoreOutlined />} type="link" />
              </Dropdown>
            </Space>
          )
        }
        return
      }
      case 'start': {
        if (me?._id !== seminarData?.createdBy?._id) {
          return (
            <Button
              onClick={() =>
                window.open(`${window.origin}/seminar/${seminarData._id}`)
              }
              key="start"
              type="primary"
            >
              Tham dự
            </Button>
          )
        }
        return null
      }
      case 'end':
        break
      default:
        break
    }
  }, [state, dataFollow])
  return (
    <Card
      style={{ marginBottom: 10 }}
      type="inner"
      title={
        <div
          style={{
            wordWrap: 'break-word',
            whiteSpace: 'break-spaces',
            width: '100%'
          }}
        >
          {seminarData.title}
        </div>
      }
      extra={extra}
    >
      <Card.Meta
        avatar={
          <Avatar
            src={seminarData?.createdBy?.avatar}
            icon={<UserOutlined />}
          />
        }
        title={`${seminarData?.createdBy?.expert?.jobTitle} ${seminarData?.createdBy?.firstname} ${seminarData?.createdBy?.lastname}`}
        description={
          <pre
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'break-spaces',
              width: '100%'
            }}
          >
            {seminarData?.description}
          </pre>
        }
      ></Card.Meta>
    </Card>
  )
}

export default SeminarDetail
