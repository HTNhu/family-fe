import React, { useState, useContext } from 'react'
import gql from 'graphql-tag'
import { withRouter } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Result, Button, Typography, Form, Modal, Input } from 'antd'
import { LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons'
import ModalResend from './modalResend'
import { IContext } from '@tools'
import * as firebase from 'firebase/app'
const { Paragraph, Text } = Typography

const VERIFY_ACCOUNT = gql`
  query verifyAccount($verifyToken: String) {
    verifyAccount(verifyToken: $verifyToken) {
      accessToken
    }
  }
`

const index = ({ history, match }) => {
  const { refetchMe } = useContext(IContext)
  const [visible, setVisible] = useState(false)
  const { me } = useContext(IContext)
  const {
    params: { verifyToken }
  } = match
  const { data, error, loading } = useQuery(VERIFY_ACCOUNT, {
    variables: {
      verifyToken
    }
  })
  return loading ? (
    <Result
      icon={<LoadingOutlined />}
      title="Đang xác minh tài khoản - giadinh.tk"
      subTitle="Vui lòng chờ trong giây lát"
    />
  ) : data?.verifyAccount ? (
    <Result
      status="success"
      title="Xác minh tài khoản thành công!"
      extra={[
        <Button
          onClick={() => {
            localStorage.setItem(
              'access-token',
              data?.verifyAccount?.accessToken
            )
            history.push('/homepage')
            refetchMe()
            if (me?.expert) {
              firebase.database().ref(`awaitVerifyExperts/${me?._id}`).set({
                createdAt: new Date().getTime()
              })
            }
          }}
          key="home"
        >
          Tiếp tục
        </Button>
      ]}
    />
  ) : (
    <Result
      status="error"
      title="Xác Minh Tài Khoản Thất Bại"
      extra={[
        <Button
          onClick={() => history.push('/login')}
          type="primary"
          key="console"
        >
          Đăng nhập
        </Button>,
        <Button onClick={() => setVisible(true)} key="buy">
          Gửi lại mail xác minh
        </Button>
      ]}
    >
      <div className="desc">
        <Paragraph>
          <Text
            strong
            style={{
              fontSize: 16
            }}
          >
            Xác minh tài khoản thất bại có thể vì lý do sau:
          </Text>
        </Paragraph>
        {error.graphQLErrors.map(({ message }, index) => (
          <Paragraph key={index}>
            <CloseCircleOutlined style={{ color: 'red' }} />
            <Text style={{ marginLeft: 5 }}>{message}</Text>
          </Paragraph>
        ))}
      </div>
      <ModalResend history={history} visible={visible} onCancel={() => setVisible(false)} />
    </Result>
  )
}

export default withRouter(index)
