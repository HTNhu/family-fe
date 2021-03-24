import React, { useRef } from 'react'
import { Row, Col, Avatar, Input, Form } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import * as firebase from 'firebase/app'
import ListComments from './listComments'

const Comments = ({ breakPoint, dataSeminar, me }) => {
  const [form] = Form.useForm()
  const listRef = useRef()
  const submitComment = ({ comment }) => {
    firebase
      .database()
      .ref(`seminars/${dataSeminar?._id}/comments/${+new Date()}`)
      .set({
        author: `${me?.firstname} ${me?.lastname}`,
        avatar: me?.avatar,
        content: comment,
        createdAt: +new Date()
      })
    form.resetFields()
  }
  return (
    <div
      style={{
        height: breakPoint ? '50vh' : '100vh',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}
    >
      <div style={{ flex: '1 1 auto' }}>
        <div style={{ borderBottom: '1px solid #ccc', padding: 10 }}>
          <h1 style={{ fontSize: 18 }}>{dataSeminar?.title}</h1>
          <div
            style={{ fontWeight: 'bold' }}
          >{`${dataSeminar?.createdBy?.expert?.jobTitle} ${dataSeminar?.createdBy?.firstname} ${dataSeminar?.createdBy?.lastname}`}</div>
        </div>
        <div
          style={{
            borderBottom: '1px solid #ccc',
            padding: 10,
            fontWeight: 'bold'
          }}
        >
          Câu hỏi và bình luận:
        </div>
      </div>
      <div ref={listRef} style={{ overflow: 'auto' }}>
        <ListComments
          idSeminar={dataSeminar?._id}
          onScrollEnd={() => {
            if (listRef.current) {
              listRef.current.scrollTop = listRef.current?.scrollHeight
            }
          }}
        />
      </div>
      <Row style={{ padding: 10, borderTop: '1px solid #ccc' }}>
        <Col xs={0} lg={4}>
          <Avatar icon={<UserOutlined />} />
        </Col>
        <Col xs={24} lg={20}>
          <Form onFinish={submitComment} form={form}>
            <Form.Item style={{ margin: 0 }} name="comment">
              <Input.TextArea
                autoFocus
                onPressEnter={e => {
                  e.preventDefault()
                  form.submit()
                }}
                style={{ width: '100%', resize: 'none' }}
                placeholder="Bạn muốn hỏi gì?"
                autoSize={{ maxRows: 4, minRows: 1 }}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default Comments
