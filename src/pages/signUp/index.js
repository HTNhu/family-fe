/* eslint-disable prefer-promise-reject-errors */
import React, { useContext } from 'react'
import {
  Input,
  Form,
  Col,
  Row,
  Button,
  DatePicker,
  Select,
  Checkbox,
  InputNumber,
  notification
} from 'antd'
import moment from 'moment'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { Logo } from '@components'
import { IContext } from '@tools'
import bg from '@assets/images/bg-family1.jpg'
const SIGN_UP = gql`
  mutation signUp($newUser: NewUser) {
    signUp(newUser: $newUser)
  }
`

const index = () => {
  const { history } = useContext(IContext)
  const [signUp] = useMutation(SIGN_UP)
  const signUpNewUser = values => {
    const { areasOfExpertise, jobTitle, yearsExperience } = values
    const expert = { areasOfExpertise, jobTitle, yearsExperience }
    delete values.areasOfExpertise
    delete values.jobTitle
    delete values.yearsExperience
    delete values['confirm-password']
    delete values.isExpert
    signUp({
      variables: {
        newUser: {
          ...values,
          birthday: values?.birthday?.valueOf() || null,
          expert
        }
      }
    }).then(({ errors }) => {
      if (!errors) {
        notification.success({
          message: 'Đăng ký thành công',
          placement: 'bottomRight'
        })
        history.push('/success')
      }
    })
  }
  const [form] = Form.useForm()
  const { getFieldValue, setFieldsValue } = form
  const disabledDate = current => {
    // Can not select days before today and today
    return current && moment().year() - current.year() < 16
  }
  return (
    <Row
      style={{
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <Col
        xs={0}
        md={12}
        style={{
          backgroundImage: `url(${bg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></Col>
      <Col xs={24} md={12} flex="auto">
        <Row
          style={{ height: '100vh', overflow: 'auto' }}
          justify="center"
          align="middle"
        >
          <Col xs={22} sm={16} md={16}>
            <div style={{ marginBottom: 30, textAlign: 'center' }}>
              <Logo size="large" />
            </div>
            <Form form={form} layout="vertical" onFinish={signUpNewUser}>
              <Form.Item label="Họ và tên">
                <Form.Item
                  style={{
                    marginRight: 6,
                    marginBottom: 0,
                    width: 'calc(50% - 6px)'
                  }}
                  name="lastname"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập họ của bạn'
                    },
                    {
                      max: 25,
                      message: 'Họ quá dài'
                    }
                  ]}
                >
                  <Input placeholder="Họ" />
                </Form.Item>
                <Form.Item
                  style={{
                    marginLeft: 6,
                    marginBottom: 0,
                    width: 'calc(50% - 6px)'
                  }}
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên của bạn'
                    },
                    {
                      max: 25,
                      message: 'Tên quá dài'
                    }
                  ]}
                >
                  <Input placeholder="Tên" />
                </Form.Item>
              </Form.Item>
              <Form.Item
                required
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập email của bạn'
                  },
                  {
                    type: 'email',
                    message: 'Email không đúng định dạng'
                  }
                ]}
                name="email"
                label="Email"
              >
                <Input type="email" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mật khẩu của bạn'
                  }
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirm-password"
                label="Nhập lại mật khẩu"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng xác nhận lại mật khẩu của bạn'
                  },
                  {
                    validator: (_, value) => {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject('Mật khẩu không trùng khớp')
                    }
                  }
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Điện thoại"
                rules={[
                  {
                    pattern: /(09|03|02|01[2|6|8|9])+([0-9]{8})/g,
                    message: 'Số điện thoại không đúng định dạng'
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="birthday" label="Ngày sinh">
                <DatePicker
                  showToday={false}
                  defaultPickerValue={moment(
                    `12/31/${new Date().getFullYear() - 16}`
                  )}
                  disabledDate={disabledDate}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn giới tính của bạn'
                  }
                ]}
              >
                <Select>
                  <Select.Option value="MALE">Nam</Select.Option>
                  <Select.Option value="FEMALE">Nữ</Select.Option>
                  <Select.Option value="OTHER">Khác</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="isExpert" valuePropName="checked">
                <Checkbox>Tôi là một chuyên gia</Checkbox>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.isExpert !== currentValues.isExpert
                }
              >
                {({ getFieldValue }) => {
                  return !!getFieldValue('isExpert') ? (
                    <>
                      <Form.Item
                        name="areasOfExpertise"
                        label="Lĩnh vực chuyên môn"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập lĩnh vực chuyên môn của bạn'
                          }
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="jobTitle"
                        label="Chức danh"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập chức danh của bạn'
                          }
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="yearsExperience"
                        label="Số năm kinh nghiệm"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập số năm kinh nghiệm của bạn'
                          }
                        ]}
                      >
                        <InputNumber style={{ width: '100%' }} />
                      </Form.Item>
                    </>
                  ) : null
                }}
              </Form.Item>
              <Form.Item
                extra={
                  <span>
                    Bạn đã có tài khoản?
                    <Button type="link" onClick={() => history.push('/login')}>
                      Đăng nhập ngay
                    </Button>
                  </span>
                }
              >
                <Button type="primary" htmlType="submit">
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default index
