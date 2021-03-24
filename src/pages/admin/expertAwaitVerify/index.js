/* eslint-disable react/display-name */
import React, { useState, useRef, useEffect } from 'react'
import { Button, Table, Space } from 'antd'
import { EyeFilled } from '@ant-design/icons'
// import CreateCommunityForm from './createCommunityForm'
import { getColumnSearchProps } from '@shared'
import * as firebase from 'firebase/app'
import DetailExpert from './detailExpert'

function index() {
  const searchRef = useRef()
  const [dataUserReport, setDataUserReport] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    firebase
      .database()
      .ref(`awaitVerifyExperts`)
      .on('value', snapshot => {
        const temp = snapshot.val()
          ? Object.keys(snapshot.val()).map(key => {
              return {
                ...snapshot.val()[key],
                id: key
              }
            })
          : []
        setDataUserReport(temp.sort((a, b) => b.createdAt - a.createdAt))
      })
  }, [])

  return (
    <>
      <Table
        style={{ height: 'calc(100vh - 103px)' }}
        rowKey="id"
        bordered
        columns={[
          {
            title: 'Mã người dùng',
            dataIndex: 'id',
            key: 'id',
            width: 300,
            render: (text, record) => <Button type="link">{text}</Button>,
            ...getColumnSearchProps('name', searchRef)
          },
          {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 200,
            render: (text, record) => (
              <div
                style={{
                  fontWeight: 'bolder'
                }}
              >
                {new Date(text).toLocaleString()}
              </div>
              // <Avatar
              //   shape="square"
              //   size="large"
              //   src={avatarUrl}
              //   icon={<UserOutlined />}
              // />
            )
          },
          {
            title: 'Action',
            key: 'action',
            width: 75,
            render: (_, record) => (
              <Space size="middle">
                <Button
                  onClick={() => {
                    setSelectedRow(record)
                    setVisible(true)
                  }}
                  type="primary"
                  icon={<EyeFilled />}
                />
                {/* <Button
                  onClick={() => {
                    setSelectedRow(record)
                    setVisible(true)
                  }}
                  type="primary"
                  icon={<VerifiedOutlined />}
                /> */}
              </Space>
            )
          }
        ]}
        dataSource={dataUserReport}
        pagination={{ pageSize: 50 }}
      />
      <DetailExpert
        rowData={selectedRow}
        visible={visible}
        onClose={() => {
          setVisible(false)
          setSelectedRow(null)
        }}
      />
    </>
  )
}

export default index
