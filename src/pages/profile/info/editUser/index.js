import React, { useContext } from 'react'
import {
  Input,
  Form,
  DatePicker,
  Radio,
  Button,
  notification,
  InputNumber,
  Checkbox,
  Drawer,
  Space
} from 'antd'
import { IContext } from '@tools'
import moment from 'moment'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_USER_INFO } from '@shared'
import * as firebase from 'firebase/app'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 }
}
const EditUser = props => {
  const { visible, onCancel, isBroken } = props
  const { me, refetchMe } = useContext(IContext)
  const [form] = Form.useForm()
  const [updateUserInfo] = useMutation(UPDATE_USER_INFO)
  const onFinish = async values => {
    const { areasOfExpertise, jobTitle, yearsExperience } = values
    const expert = {
      areasOfExpertise,
      jobTitle,
      yearsExperience
    }
    delete values.areasOfExpertise
    delete values.jobTitle
    delete values.yearsExperience
    delete values['confirm-password']
    delete values.isExpert
    await updateUserInfo({
      variables: {
        userId: me?._id,
        userInfo: {
          ...values,
          expert,
          birthday: values.birthday
            ? Date.parse(values.birthday.toString())
            : null
        }
      }
    }).then(async res => {
      form.resetFields()
      await refetchMe()
      onCancel()
    })
    if (!me?.expert?.isVerify) {
      firebase.database().ref(`awaitVerifyExperts/${me?._id}`).set({
        createdAt: new Date().getTime()
      })
    }
    notification.success({ message: 'Cập nhật thông tin thành công' })
  }
  const disabledDate = current => {
    // Can not select days before today and today
    return current && moment().year() - current.year() < 16
  }
  return (
    <Drawer
      width={isBroken ? '100%' : '40%'}
      visible={visible}
      title="Chỉnh sửa thông tin"
      closable={false}
      afterVisibleChange={() => form.resetFields()}
      onClose={() => onCancel()}
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={() => onCancel()}>Hủy</Button>
          <Button onClick={() => form.submit()} type="primary">
            Lưu
          </Button>
        </Space>
      }
      afterClose={() => form.resetFields()}
    >
      <Form
        layout="vertical"
        name="dynamic_rule"
        form={form}
        onFinish={onFinish}
        initialValues={{
          isExpert: me?.expert,
          areasOfExpertise: me?.expert?.areasOfExpertise,
          yearsExperience: me?.expert?.yearsExperience,
          jobTitle: me?.expert?.jobTitle,
          firstname: me?.firstname,
          lastname: me?.lastname,
          phoneNumber: me?.phoneNumber,
          gender: me?.gender,
          birthday: me?.birthday
            ? moment(new Date(me?.birthday).toLocaleDateString())
            : null
        }}
      >
        <Form.Item
          // {getFieldDecorator('username', {
          //     rules: [{ required: true }],
          //   })(<Input />)}
          {...formItemLayout}
          name="firstname"
          label="Tên"
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
          //   initialValue={me?.firstname}
        >
          <Input />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="lastname"
          label="Họ"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập họ của bạn'
            },
            {
              pattern: /^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/,
              message: 'Họ tên chỉ được nhập chữ'
            },
            {
              max: 25,
              message: 'Họ quá dài'
            }
          ]}
          //   initialValue={me?.lastname}
        >
          <Input />
        </Form.Item>
        <Form.Item {...formItemLayout} name="birthday" label="Ngày sinh">
          <DatePicker
            // hideDisabledOptions
            showToday={false}
            defaultPickerValue={
              me?.birthday
                ? moment(new Date(me?.birthday).toLocaleDateString())
                : moment(`12/31/${new Date().getFullYear() - 16}`)
            }
            disabledDate={disabledDate}
            style={{ width: '100%' }}
            format="DD-MM-YYYY"
          />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="gender"
          label="Giới tính"
          //   initialValue={me?.bio}
        >
          <Radio.Group>
            <Radio value="MALE">Nam</Radio>
            <Radio value="FEMALE">Nữ</Radio>
            <Radio value="OTHER">Khác</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          rules={[
            {
              pattern: /(09|03|02|01[2|6|8|9])+([0-9]{8})/g,
              message: 'Số điện thoại không đúng định dạng'
            }
          ]}
          {...formItemLayout}
          name="phoneNumber"
          label="Số điện thoại"
          //   initialValue={me?.phone}
        >
          <Input />
        </Form.Item>
        {!me?.expert?.isVerify && (
          <Form.Item name="isExpert" valuePropName="checked">
            <Checkbox>Tôi là một chuyên gia</Checkbox>
          </Form.Item>
        )}
        <Form.Item
          {...formItemLayout}
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.isExpert !== currentValues.isExpert
          }
        >
          {({ getFieldValue }) => {
            return !!getFieldValue('isExpert') ? (
              <>
                <Form.Item
                  {...formItemLayout}
                  name="areasOfExpertise"
                  label="Lĩnh vực chuyên môn"
                >
                  <Input disabled={me?.expert?.isVerify} />
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  name="jobTitle"
                  label="Chức danh"
                >
                  <Input disabled={me?.expert?.isVerify} />
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  name="yearsExperience"
                  label="Số năm kinh nghiệm"
                >
                  <InputNumber
                    disabled={me?.expert?.isVerify}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </>
            ) : null
          }}
        </Form.Item>
      </Form>
    </Drawer>
  )
}
export default EditUser
