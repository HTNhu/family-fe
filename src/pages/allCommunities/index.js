import React, { useContext, useState, useEffect } from 'react'
import { List, Skeleton, Typography } from 'antd'
import { CommunityItem, HighLightPost } from '@components'
import * as firebase from 'firebase/app'

function AllCommunities(props) {
  // const { data, loading } = useQuery(GET_COMMUNITIES)
  const [loading, setLoading] = useState(false)
  const [dataCount, setDataCount] = useState([])
  useEffect(() => {
    getCount()
  }, [])
  const getCount = () => {
    setLoading(true)
    firebase.database().ref('communities').on('value', snapshot => {
      const temp = snapshot.val() ? Object.keys(snapshot.val()).map(key => ({
        ...snapshot.val()[key],
        id: key
      })) : []
      setDataCount(temp)
      setLoading(false)
    })
  }
  return loading ? (
    <Skeleton active avatar />
  ) : (
    <>
    {/* <HighLightPost history={props.history} ></HighLightPost> */}
      <Typography.Title level={4}>Tất cả cộng đồng </Typography.Title>
      <List
        pagination={{
          pageSize: 7
        }}
        itemLayout="horizontal"
        dataSource={dataCount}
        renderItem={item => <CommunityItem isActionJoin={true} item={item} />}
      />
    </>
  )
}
export default AllCommunities
