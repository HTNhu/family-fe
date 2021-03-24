import React from 'react'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

const UploadButton = ({ loading }) => {
  return (
    <div>
      {loading ? <Spin /> : <PlusOutlined />}
      <div>Upload</div>
    </div>
  )
}
export default UploadButton
