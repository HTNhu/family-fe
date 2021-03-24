import React, { useState, forwardRef, useImperativeHandle } from 'react'
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Col,
  Row,
  notification
} from 'antd'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import { notificationError } from '@shared'

const CREATE_SEMINAR = gql`
  mutation createSeminar($newSeminar: NewSeminar) {
    createSeminar(newSeminar: $newSeminar)
  }
`

const UPDATE_SEMINAR = gql`
  mutation updateSeminar($_id: ID, $newSeminar: NewSeminar) {
    updateSeminar(_id: $_id, newSeminar: $newSeminar)
  }
`

const ModalSeminar = forwardRef((props, ref) => {
  const { refetchSeminars, seminarData } = props
  const [visible, setVisible] = useState(false)
  useImperativeHandle(ref, () => ({
    openModal: () => setVisible(true)
  }))
  const [createSeminar] = useMutation(CREATE_SEMINAR)
  const [updateSeminar] = useMutation(UPDATE_SEMINAR)
  const [form] = Form.useForm()
  const submitCreateSeminar = ({ title, description, time, date }) => {
    const startTime = new Date(+moment(time))
    const startDate = new Date(+moment(date))
    if (!!seminarData) {
      updateSeminar({
        variables: {
          _id: seminarData?._id,
          newSeminar: {
            title,
            description,
            startAt: startDate.setHours(
              startTime.getHours(),
              startTime.getMinutes(),
              0
            )
          }
        }
      })
        .then(({ errors }) => {
          if (!errors) {
            notification.success({
              message: 'Cập nhật hội thảo thành công',
              placement: 'bottomRight'
            })
            setVisible(false)
          }
        })
        .catch(notificationError)
    } else {
      createSeminar({
        variables: {
          newSeminar: {
            title,
            description,
            startAt: startDate.setHours(
              startTime.getHours(),
              startTime.getMinutes(),
              0
            )
          }
        }
      })
        .then(({ errors }) => {
          if (!errors) {
            notification.success({
              message: 'Tạo hội thảo thành công',
              placement: 'bottomRight'
            })
            setVisible(false)
          }
        })
        .catch(notificationError)
    }
  }

  return (
    <Modal
      centered
      title="Hội thảo mới"
      visible={visible}
      onCancel={() => setVisible(false)}
      afterClose={() => {
        refetchSeminars()
        form.resetFields()
      }}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        onFinish={submitCreateSeminar}
        initialValues={{
          title: seminarData?.title,
          description: seminarData?.description,
          date: moment(seminarData?.startAt),
          time: moment(seminarData?.startAt)
        }}
        layout="vertical"
      >
        <Form.Item
          label="Chủ đề"
          name="title"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập chủ đề của hội thảo'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Thông tin chi tiết" name="description">
          <Input.TextArea
            style={{ resize: 'none', borderRadius: 0 }}
            rows={5}
          />
        </Form.Item>
        <Form.Item required label="Thời gian bắt đầu">
          <Row style={{ width: '100%' }}>
            <Col span={10}>
              <Form.Item
                name="date"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn ngày bắt đầu của hội thảo'
                  }
                ]}
              >
                <DatePicker
                  disabledDate={current => {
                    // Can not select days before today and today
                    return current && current < moment().startOf('day')
                  }}
                  placeholder="Ngày bắt đầu"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={10} offset={1}>
              <Form.Item
                name="time"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn giờ bắt đầu của hội thảo'
                  }
                ]}
              >
                <TimePicker
                  placeholder="Giờ bắt đầu"
                  format="HH:mm"
                  disabledHours={() => {
                    if (
                      form.getFieldValue('date').startOf('day').valueOf() ===
                      moment().startOf('day').valueOf()
                    ) {
                      return Array.from(Array(moment().get('hour')).keys())
                    }
                  }}
                  disabledMinutes={hour => {
                    if (moment().get('hour') === hour) {
                      return Array.from(
                        Array(moment().get('minute') + 1).keys()
                      )
                    }
                  }}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default ModalSeminar
