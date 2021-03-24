import React from 'react'
import { Button, Space, Drawer, List } from 'antd'
import { PostHaveGroup, PostNoGroup } from '@components'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { HighLightToxicWords } from '@shared'

const DetailMemberReport = ({
  reasonsData,
  visible,
  onClose,
  setSelectedRowKeys,
  selectedRowKeys,
  reasons
}) => {
  return (
    <Drawer
      title="Danh sách bình luận"
      visible={visible}
      onClose={onClose}
      closable={false}
      width="90%"
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            onClick={() => {
              const a = [...selectedRowKeys, reasonsData?.id]
              setSelectedRowKeys(a)
              onClose()
            }}
            type="primary"
            disabled={
              [...selectedRowKeys].findIndex(ids => ids === reasonsData?.id) !==
              -1
            }
          >
            Chọn
          </Button>
        </Space>
      }
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          height: '100%',
          overflowY: 'visible'
        }}
      >
        {reasonsData && (
          <List
            itemLayout="horizontal"
            dataSource={reasonsData?.detail}
            renderItem={item => <List.Item><h3 dangerouslySetInnerHTML={{
              __html: HighLightToxicWords(item?.reason)
            }}></h3></List.Item>}
          />
        )}
      </div>
    </Drawer>
  )
}

export default DetailMemberReport
