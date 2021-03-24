import React, { useState, useRef } from 'react'
import { Drawer, Space, Button } from 'antd'
import CreatePostForm from './createPostForm'

function CreatePostDrawer(props) {
  const formRef = useRef()
  const { visible, handleCancel, data, refetch } = props
  const [confirmLoading, setConfirmLoading] = useState(false)
  return (
    <Drawer
      confirmLoading={confirmLoading}
      afterVisibleChange={visible =>
        !visible && formRef?.current?.handleAfterClose()
      }
      width="100%"
      closable={false}
      visible={visible}
      title="Bài viết mới"
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={handleCancel}>Hủy</Button>
          <Button
            onClick={async() => {
              formRef?.current?.handleOk()
            }}
            type="primary"
          >
            Đăng bài
          </Button>
        </Space>
      }
    >
      <div style={{ width: '90%', margin: '0 auto' }}>
        <CreatePostForm
          data={data}
          refetch={refetch}
          ref={formRef}
          setConfirmLoading={setConfirmLoading}
          handleCancel={handleCancel}
        />
      </div>
    </Drawer>
  )
}
export default CreatePostDrawer
