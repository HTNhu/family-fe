import React from 'react'
import { Button, Space, Drawer, Row, Col, notification } from 'antd'
import { useQuery, useMutation } from '@apollo/react-hooks'
import * as firebase from 'firebase/app'
import { GET_USER, VERIFY_OR_REJECT_EXPERT, notificationError } from '@shared'
import { VerifiedOutlined, CloseSquareOutlined } from '@ant-design/icons'
const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
)

const DetailExpert = ({ rowData, visible, onClose }) => {
  const { data } = useQuery(GET_USER, { variables: { userId: rowData?.id } })
  const [verifyOrRejectExpert] = useMutation(VERIFY_OR_REJECT_EXPERT)
  const verifyOrReject = async isVerify => {
    await verifyOrRejectExpert({
      variables: {
        userId: rowData?.id,
        isVerify
      }
    })
      .then(({ data }) => {
        notification.success({
          message: 'Hoàn tất',
          placement: 'bottomRight'
        })
        firebase.database().ref(`awaitVerifyExperts/${rowData?.id}`).remove()
        if (isVerify) {
          firebase
            .database()
            .ref('notifications/' + rowData?.id + '/' + new Date().getTime())
            .set({
              action: 'verify',
              reciever: rowData?.id,
              link: `/${rowData?.id}/info`,
              content: `Chúc mừng bạn đã được xác nhận trở thành chuyên gia.`,
              seen: false,
              createdAt: +new Date()
            })
        } else {
          firebase
            .database()
            .ref('notifications/' + rowData?.id + '/' + new Date().getTime())
            .set({
              action: 'reject',
              reciever: rowData?.id,
              link: `/${rowData?.id}/info`,
              content: `Yêu cầu xác nhận chuyên gia của bạn đã bị từ chối.`,
              seen: false,
              createdAt: +new Date()
            })
        }
        onClose()
      })
      .catch(notificationError)
  }
  return (
    <Drawer
      title="Thông tin chuyên gia"
      visible={visible}
      onClose={onClose}
      closable={false}
      width="50%"
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={onClose}>Hủy</Button>
        </Space>
      }
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          overflowY: 'auto'
        }}
      >
        {rowData && (
          <>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="Họ tên"
                  content={`${data?.getUser?.firstname} ${data?.getUser?.lastname}`}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="Tài khoản"
                  content={data?.getUser?.email}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="Lĩnh vực chuyên môn"
                  content={data?.getUser?.expert?.areasOfExpertise}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="Chức danh"
                  content={data?.getUser?.expert?.jobTitle}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="Số năm kinh nghiệm"
                  content={data?.getUser?.expert?.yearsExperience}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="Trạng thái"
                  content={
                    data?.getUser?.expert?.isVerify ? 'Đã duyện' : 'Chờ duyệt'
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="Ngày sinh"
                  content={
                    data?.getUser?.birthday
                      ? new Date(data?.getUser?.birthday).toLocaleDateString()
                      : '-'
                  }
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="Giới tính"
                  content={
                    !data?.getUser?.gender
                      ? '-'
                      : data?.getUser?.gender === 'FEMALE'
                      ? 'Nữ'
                      : data?.getUser?.gender === 'MALE'
                      ? 'Nam'
                      : 'Khác'
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem title="Email" content={data?.getUser?.email} />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="Số điện thoại"
                  content={data?.getUser?.phoneNumber}
                />
              </Col>
            </Row>
          </>
        )}
        <Space size="middle">
          <Button
            onClick={() => {
              verifyOrReject(true)
            }}
            type="primary"
            icon={<VerifiedOutlined />}
          >
            {' '}
            Xác minh{' '}
          </Button>
          <Button
            type="danger"
            onClick={() => {
              verifyOrReject(false)
            }}
            icon={<CloseSquareOutlined />}
          >
            Từ chối{' '}
          </Button>
        </Space>
      </div>
    </Drawer>
  )
}

export default DetailExpert
