import React from 'react'
import { List, Skeleton } from 'antd'
import CommunityItem from '../community'
import { ArrowRightOutlined } from '@ant-design/icons'

function HighlightGroup(props) {
  const { dataCount, loading } = props
  return loading ? (
    <Skeleton active avatar />
  ) : (
    <>
      <List
        itemLayout="horizontal"
        dataSource={dataCount
          ?.sort(
            (a, b) =>
              b.membersCount + b.postsCount - (a.membersCount + a.postsCount)
          )
          .slice(0, 3)}
        renderItem={item => (
          <CommunityItem
            item={item}
            setShowCommunities={props?.setShowCommunities}
          />
        )}
      />
      <a
        onClick={() => {
          props?.setShowCommunities && props.setShowCommunities(false)
          props.history.push('/communities')
        }}
      >
        Xem tất cả cộng đồng <ArrowRightOutlined />
      </a>
    </>
  )
}
export default HighlightGroup
