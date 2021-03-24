import React, { useState } from 'react'
import { Modal, Tabs, List } from 'antd'
import ReactionInfo from '../reactionInfo'
const emojiData = [
  {
    emoji: '+1',
    text: 'Thích',
    count: 7
  },
  {
    emoji: 'heart_eyes',
    text: 'Yêu thích',
    count: 3
  },
  {
    emoji: 'open_mouth',
    text: 'Wow',
    count: 9
  },
  {
    emoji: 'joy',
    text: 'Hihi',
    count: 43
  }
]
const ModalReactionInfo = props => {
  const { reactions, visible, setVisible } = props
  const [currenTab, setCurentTab] = useState()
  return (
    <Modal
      centered
      title="Người dùng tương tác"
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      closable
    >
      <Tabs defaultActiveKey={currenTab} onChange={key => setCurentTab(key)}>
        {reactions
          .filter(reaction => reaction?.count !== 0)
          ?.map(reaction => (
            <Tabs.TabPane
              tab={emojiData.filter(emo => emo.emoji === reaction.id)[0].text}
              key={reaction.id}
            >
              {reaction?.users.map(item => (
                <List key={item}>
                  <ReactionInfo userId={item} />
                </List>
              ))}
            </Tabs.TabPane>
          ))}
      </Tabs>
    </Modal>
  )
}
export default ModalReactionInfo
