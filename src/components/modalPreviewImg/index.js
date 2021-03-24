/* eslint-disable react/prop-types */
import React from 'react'
import Modal from 'antd/lib/modal/Modal'

function ModalPreviewImg (props) {
 const { previewImg, onCancel } = props

  return (
    <Modal
    visible={previewImg.isShow}
    footer={null}
    onCancel={() => onCancel()}
  >
    <img
      alt="example"
      style={{ width: '100%', paddingTop: 20, height: '50vh', objectFit: 'cover' }}
      src={previewImg.imgSrc}
    />
  </Modal>
  )
}
export default ModalPreviewImg
