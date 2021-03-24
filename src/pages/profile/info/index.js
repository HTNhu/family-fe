/* eslint-disable react/prop-types */
import React, { useState, useContext } from 'react'
import { Row, Col, Tooltip, Tag } from 'antd'
import { EditTwoTone } from '@ant-design/icons'
import EditUser from './editUser'
const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
)
function Info(props) {
  const { userInfo, isMe, dataCountFollow, isBroken } = props
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Row>
        <Col span={12}>
          <div style={{ display: 'flex' }}>
            <p
              className="site-description-item-profile-p"
              style={{ marginBottom: 24, marginRight: 10 }}
            >
              Thông tin
            </p>
            <span>
              {userInfo?.expert?.isVerify && (
                <Tag color="blue">{userInfo?.expert?.jobTitle}</Tag>
              )}
            </span>
          </div>
        </Col>
        {isMe && (
          <Col span={12}>
            <Tooltip title="Chỉnh sửa thông tin">
              <EditTwoTone onClick={() => setVisible(true)} />
            </Tooltip>
          </Col>
        )}
      </Row>
      <Row>
        <Col span={isBroken ? 24 : 12}>
          <DescriptionItem
            title="Họ tên"
            content={`${userInfo?.firstname} ${userInfo?.lastname}`}
          />
        </Col>
        <Col span={isBroken ? 24 : 12}>
          <DescriptionItem title="Tài khoản" content={userInfo?.email} />
        </Col>
      </Row>
      <Row>
        <Col span={isBroken ? 24 : 12}>
          <DescriptionItem
            title="Ngày sinh"
            content={
              userInfo?.birthday
                ? new Date(userInfo?.birthday).toLocaleDateString()
                : '-'
            }
          />
        </Col>
        <Col span={isBroken ? 24 : 12}>
          <DescriptionItem
            title="Giới tính"
            content={
              !userInfo?.gender
                ? '-'
                : userInfo?.gender === 'FEMALE'
                ? 'Nữ'
                : userInfo?.gender === 'MALE'
                ? 'Nam'
                : 'Khác'
            }
          />
        </Col>
      </Row>
      <Row>
        <Col span={isBroken ? 24 : 12}>
          <DescriptionItem title="Email" content={userInfo?.email} />
        </Col>
        <Col span={isBroken ? 24 : 12}>
          <DescriptionItem
            title="Số điện thoại"
            content={userInfo?.phoneNumber}
          />
        </Col>
      </Row>
      {/* <Row>
        <Col span={24}>
          <DescriptionItem
            title="Tham gia ngày"
            content={userInfo?.createdAt}
          />
        </Col>
      </Row> */}
      <Row>
        <Col span={24}>
          <DescriptionItem
            title="Số người theo dõi"
            content={dataCountFollow?.getFollowerByUser?.length}
          />
        </Col>
      </Row>
      <EditUser
        isBroken={props?.isBroken}
        visible={visible}
        onCancel={() => setVisible(!visible)}
      ></EditUser>
    </>
  )
}

export default Info
