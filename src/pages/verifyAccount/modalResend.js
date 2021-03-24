import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Modal, Form, Input, Result } from 'antd'

const RE_SEND_CONFIRM_MAIL = gql`
  mutation resendConfirmMail($email: String!) {
    resendConfirmMail(email: $email)
  }
`

const ModalResend = ({ history, visible, onCancel }) => {
  const [form] = Form.useForm()
  const [loadingConfirm, setLoadingConfirm] = useState(false)
  const [result, setResult] = useState(null)
  const [resendConfirmMail] = useMutation(RE_SEND_CONFIRM_MAIL)
  const resendMail = ({ email }) => {
    setLoadingConfirm(true)
    resendConfirmMail({
      variables: {
        email
      }
    }).then(({ data: { resendConfirmMail } }) => {
      if (resendConfirmMail) {
        setResult(
          <Result
            status="success"
            title="Mail xác minh đã được gửi lại!"
            subTitle="Vui lòng kiểm tra lại mail của bạn.Nếu không thấy bạn có thể kiểm tra trong thư rác hoặc thư quảng cáo. Mọi thắc mắc xin liên hệ với hỗ trợ qua hotro01.giadinh@gmail.com. Xin cảm ơn!"
          />
        )
        setLoadingConfirm(false)
      } else {
        setResult(
          <Result
            status="error"
            title="Mail xác minh không thể gửi lại!"
            subTitle="Vui lòng liên hệ với hỗ trợ qua hotro01.giadinh@gmail.com để được hỗ trợ thêm. Xin cảm ơn!"
          />
        )
        setLoadingConfirm(false)
      }
    })
  }
  return (
    <Modal
      confirmLoading={loadingConfirm}
      centered
      visible={visible}
      onCancel={onCancel}
      title="Gửi lại mail xác minh"
      okButtonProps={{ htmlType: 'submit', hidden: !!result }}
      onOk={() => form.submit()}
      cancelText={!!result ? 'Close' : 'Cancel'}
      afterClose={() => {
        setLoadingConfirm(false)
        setResult(null)
        form.resetFields()
        if (!!result) {
          history.push('/homepage')
        }
      }}
    >
      {result || (
        <Form onFinish={resendMail} form={form} layout="vertical">
          <Form.Item rules={[
            {
              required: true,
              message: 'Vui lòng nhập email của bạn'
            },
            {
              type: 'email',
              message: 'Email này không hợp lệ'
            }
          ]} name="email" label="Email">
            <Input />
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}

export default ModalResend
