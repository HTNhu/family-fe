import React from 'react'
import { Avatar, List } from 'antd'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { GET_USER } from '@shared'

function ItemReport({ data }) {
  const history = useHistory()

  const { data: dataUser } = useQuery(GET_USER, {
    variables: { userId: data?.id },
    fetchPolicy: 'no-cache'
  })
  return (
    <List.Item
      style={{ backgroundColor: '#fff', marginBottom: 10, padding: 10 }}
    >
      <List.Item.Meta
        style={{ display: 'flex' }}
        avatar={<Avatar src={dataUser?.getUser?.avatar} />}
        title={
          <a
            style={{ color: '#abb' }}
            onClick={() => history.push(`/${dataUser?.getUser?._id}/info`)}
          >
            {dataUser?.getUser?.firstname}
          </a>
        }
        description={<p style={{ color: 'red', fontWeight: 'bold' }}>{data.reason || 'Lý do khác'}</p>}
      />
    </List.Item>
  )
}
export default ItemReport
