import React from 'react'
import './ConversationSearch.css'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export default function ConversationSearch(props) {
  return (
    <div className="conversation-search">
      <Input
        onChange={(e) => props.search(e.target.value)}
        className="search-flex"
        prefix={<SearchOutlined />}
        placeholder="Tìm kiếm"
      ></Input>
    </div>
  )
}
