import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { GET_USER } from '@shared'
import './index.scss'
import { LoadingOutlined } from '@ant-design/icons'
import { Avatar, List } from 'antd'
import { Follow } from '@components'
import { IContext } from '@tools'
const ReactionInfo = ({ userId, type }) => {
  const { data, loading } = useQuery(GET_USER, {
    variables: { userId },
    fetchPolicy: 'no-cache'
  })
  const { me } = useContext(IContext)

  return loading ? (
    <LoadingOutlined />
  ) : type ? (
    <div>
      <a href={`${window.location.origin}/${userId}/info`}>
        {data?.getUser?.firstname}
      </a>
    </div>
  ) : (
    <List.Item
      actions={[
        me?._id !== data?.getUser?._id && <Follow
          key={data?.getUser?._id}
          follower={{ userId: userId, followerId: me?._id }}
        />
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={data?.getUser?.avatar} />}
        title={
          <a href={`${window.location.origin}/${userId}/info`}>
            {data?.getUser?.firstname || 'Người dùng không còn tồn tại'}
          </a>
        }
      />
    </List.Item>
  )
}
export default ReactionInfo
