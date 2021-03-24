import React, { useState, forwardRef, useImperativeHandle } from 'react'
import {
  Drawer,
  Form,
  Select,
  DatePicker,
  Input,
  Space,
  Button,
  notification,
  Checkbox
} from 'antd'
import moment from 'moment'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { notificationError } from '@shared'

const CREATE_ADMIN = gql`
  mutation createAdmin($newAdmin: NewAdmin) {
    createAdmin(newAdmin: $newAdmin)
  }
`

const UPDATE_ADMIN = gql`
  mutation updateAdmin($_id: ID, $newAdmin: NewAdmin) {
    updateAdmin(_id: $_id, newAdmin: $newAdmin)
  }
`

const ManageAdminForm = forwardRef((props, ref) => {
  const { dataAdmin, refetchAdmins } = props
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const { setFieldsValue, submit } = form
  useImperativeHandle(ref, () => ({
    openForm: () => setVisible(true)
  }))
  const onClose = () => setVisible(false)
  const [createAdmin] = useMutation(CREATE_ADMIN)
  const [updateAdmin] = useMutation(UPDATE_ADMIN)
  const submitForm = values => {
    setLoading(true)
    delete values['confirm-password']
    if (dataAdmin) {
      delete values.isUpdatePassword
      updateAdmin({
        variables: {
          _id: dataAdmin?._id,
          newAdmin: {
            ...values,
            birthday: values.birthday.valueOf()
          }
        }
      })
        .then(() => {
          notification.success({
            message: 'Cập nhật thành công!',
            placement: 'bottomRight'
          })
          refetchAdmins()
        })
        .catch(notificationError)
    } else {
      createAdmin({
        variables: {
          newAdmin: {
            ...values,
            birthday: values.birthday.valueOf()
          }
        }
      })
        .then(() => {
          notification.success({
            message: 'Thêm mới thành công!',
            placement: 'bottomRight'
          })
          refetchAdmins()
        })
        .catch(notificationError)
    }
    onClose()
  }
  return (
    <Drawer
      width="50%"
      visible={visible}
      onClose={onClose}
      title={dataAdmin ? 'Cập nhật admin' : 'Admin mới'}
      footer={
        <Space style={{ float: 'right' }}>
          <Button disabled={loading} onClick={onClose}>
            Hủy
          </Button>
          <Button loading={loading} onClick={() => submit()} type="primary">
            {dataAdmin ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Space>
      }
      afterVisibleChange={visible => {
        if (!visible) {
          setLoading(false)
        }
        form.resetFields()
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ ...dataAdmin, birthday: moment(dataAdmin?.birthday) }}
        onFinish={submitForm}
      >
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
                message: 'Vui lòng nhập họ của admin'
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
                message: 'Vui lòng nhập tên của admin'
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
              message: 'Vui lòng nhập email của admin'
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
        {dataAdmin && (
          <Form.Item name="isUpdatePassword" valuePropName="checked">
            <Checkbox>Cập nhật mật khẩu</Checkbox>
          </Form.Item>
        )}
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.isUpdatePassword !== currentValues.isUpdatePassword
          }
        >
          {({ getFieldValue }) => {
            return !!getFieldValue('isUpdatePassword') || !dataAdmin ? (
              <>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mật khẩu của admin'
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
                      message: 'Vui lòng xác nhận lại mật khẩu của admin'
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
              </>
            ) : null
          }}
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Điện thoại"
          rules={[
            {
              validator: (_, value) => {
                if (value && /\D+/g.test(value)) {
                  setFieldsValue({
                    phoneNumber: value.substring(0, value.length - 1)
                  })
                  return Promise.reject('Số điện thoại chỉ chứa ký tự số')
                }
                if (value.length > 10) {
                  return Promise.reject('Số điện thoại không đúng định dạng')
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="birthday" label="Ngày sinh">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn giới tính của admin'
            }
          ]}
        >
          <Select>
            <Select.Option value="MALE">Nam</Select.Option>
            <Select.Option value="FEMALE">Nữ</Select.Option>
            <Select.Option value="OTHER">Khác</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  )
})

export default ManageAdminForm
