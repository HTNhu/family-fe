import React, { useContext } from 'react'
import background from '@assets/images/background-admin.jpg'
import logo from '@assets/images/logo.png'
import { Row, Col, Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { IContext } from '@tools'
import { notificationError } from '@shared'

const SIGN_IN = gql`
  mutation signIn($email: String, $password: String) {
    signIn(email: $email, password: $password) {
      accessToken
    }
  }
`

function index() {
  const { authenticate } = useContext(IContext)
  const [signIn] = useMutation(SIGN_IN)
  const login = ({ email, password }) => {
    signIn({
      variables: {
        email,
        password
      }
    }).then(({ data }) => {
      authenticate(data?.signIn?.accessToken)
    }).catch(notificationError)
  }
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        background: `url(${background}) no-repeat center center fixed`,
        backgroundSize: 'cover'
      }}
    >
      <Col xs={20} md={7}>
        <Form onFinish={login}>
          <Form.Item>
            <Row style={{ width: '100%' }} justify="center" align="middle">
              <img src={logo} height={150} />
            </Row>
          </Form.Item>
          <Form.Item name="email">
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item name="password">
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              style={{ marginBottom: 10 }}
              type="primary"
              icon={<LoginOutlined />}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default index
