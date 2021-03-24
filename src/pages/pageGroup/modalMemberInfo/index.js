import React from 'react'
import { Modal, List } from 'antd'
import ReactionInfo from '../../../components/post/reactionInfo'
const ModalMemberInfo = props => {
  const { members, isBroken, visible, setVisible } = props
  return (
    <Modal
      centered
      title="Thành viên"
      visible={visible}
      onCancel={() => setVisible(false)}
      closable
      footer={null}
    >
      {members?.map(data => (
        <List key={data?.user?._id}>
          <ReactionInfo userId={data?.user?._id} />
        </List>
      ))}
    </Modal>
  )
}
export default ModalMemberInfo
