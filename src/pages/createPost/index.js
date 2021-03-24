import React, { useRef, useState } from 'react'
import { withRouter } from 'react-router-dom'
// import { CreatePostForm } from '@components'
import { Button, Typography } from 'antd'

const CreatePost = props => {
  const formRef = useRef(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  return (
    <>
      <Typography.Title level={3}>Bài Viết Mới</Typography.Title>
      {/* <CreatePostForm ref={formRef} setConfirmLoading={setConfirmLoading} /> */}
      <div
        style={{
          margin: '15px 0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <Button
          style={{
            fontWeight: 'bolder',
            marginRight: 15,
            textAlign: 'center'
          }}
        >
          Hủy
        </Button>
        <Button
          loading={confirmLoading}
          onClick={() => {
            formRef.current?.handleOk()
            props.history.push('./homepage')
          }}
          style={{ fontWeight: 'bolder' }}
          type="primary"
        >
          Đăng bài
        </Button>
      </div>
    </>
  )
}

export default withRouter(CreatePost)
