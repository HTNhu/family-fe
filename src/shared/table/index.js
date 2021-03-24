/* eslint-disable react/display-name */
import React from 'react'
import { Input, Space, Button } from "antd"
import { SearchOutlined } from "@ant-design/icons"

export const getColumnSearchProps = (dataIndex, inputRef) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        ref={inputRef}
        value={selectedKeys[0]}
        placeholder={`Search ${dataIndex}`}
        onChange={e => {
          setSelectedKeys([e.target.value])
        }}
        onPressEnter={() => confirm()}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => clearFilters()}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: filtered => (
    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  onFilterDropdownVisibleChange: visible => {
    if (visible) {
      setTimeout(() => inputRef.current.select())
    }
  }
})
