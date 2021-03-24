import React, { useEffect, useContext, useState } from 'react'
import { withRouter } from 'react-router-dom'
import * as firebase from 'firebase/app'
import { IContext } from '@tools'
import NotiList from '../../components/noti/notiList'
import { List } from 'antd'
const Notify = props => {
  const [notifications, setNotifications] = useState([])
  // const [visible, setVisible] = useState(false)
  const { me } = useContext(IContext)
  const { history } = props
  useEffect(() => {
    getNotification()
  }, [me])
  const getNotification = () => {
    let temp
    firebase
      .database()
      .ref('notifications/' + me?._id)
      .orderByKey()
      .limitToLast(50)
      .on('value', snapshot => {
        temp = snapshot.val()
          ? Object.keys(snapshot.val()).map(key => ({
              ...snapshot.val()[key],
              id: key
            }))
          : []

        setNotifications(temp.reverse())
      })
  }
  return notifications?.length === 0 ? (
    <p>Chưa có thông báo nào</p>
  ) : (
    <List
      style={{ overflowY: 'visible' }}
      className="demo-loadmore-list"
      // loading={initLoading}
      itemLayout="horizontal"
      dataSource={notifications}
      renderItem={noti => <NotiList noti={noti} history={history}></NotiList>}
    />
  )
}
export default withRouter(Notify)
