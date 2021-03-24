import React from 'react'
import { useHistory } from 'react-router-dom'
import { PostNoGroup, PostHaveGroup } from '@components'
import { Empty, Typography } from 'antd'

function index() {
  const {
    location: {
      state: { query, results }
    }
  } = useHistory()

  return (
    <div>
      <Typography.Title level={2}>Kết quả tìm kiếm cho: {query}</Typography.Title>
      {results.length === 0 ? (
        <Empty />
      ) : (
        results?.map((item, idx) => {
          return item?.community ? (
            <PostHaveGroup key={idx} item={item} />
          ) : (
            <PostNoGroup key={idx} item={item} />
          )
        })
      )}
    </div>
  )
}

export default index
