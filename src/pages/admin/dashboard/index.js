import React, { useState, useEffect } from 'react'
import { Line } from '@ant-design/charts'
import * as firebase from 'firebase/app'
import { Card, Button } from 'antd'
import { RetweetOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

const REFERSH_REPORT = gql`
  mutation refreshDataReport {
    refreshDataReport
  }
`

function index() {
  const [data, setData] = useState(null)
  const [refreshDataReport] = useMutation(REFERSH_REPORT)

  useEffect(() => {
    firebase
      .database()
      .ref('report')
      .on('value', snapshot => {
        setData(snapshot.val())
      })
  }, [])

  return (
    <Card
      title="Thống kê diễn đàn Family trong 14 ngày gần nhất"
      extra={
        <Button onClick={() => refreshDataReport()} icon={<RetweetOutlined />}>
          Refresh
        </Button>
      }
    >
      <Line
        description={{ text: `Cập nhật lần cuối lúc: ${data && new Date(data?.updatedAt).toLocaleString()}`, visible: true }}
        padding="auto"
        forceFit
        xField="date"
        yField="count"
        seriesField="type"
        responsive
        legend={{
          position: 'top-right'
        }}
        data={data?.lastDays || []}
      />
    </Card>
  )
}

export default index
