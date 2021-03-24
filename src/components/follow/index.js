import React, { useContext } from 'react'
import * as firebase from 'firebase/app'
import { Button, Popconfirm } from 'antd'
import { HeartTwoTone, HeartFilled } from '@ant-design/icons'
import { CREATE_FOLLOWER, DELETE_FOLLOWER, CHECK_FOLLOW } from '@shared'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { IContext } from '@tools'

function Follow(props) {
  const { me, isAuth, openLoginModal } = useContext(IContext)
  const [createFollower] = useMutation(CREATE_FOLLOWER)
  const [deleteFollower] = useMutation(DELETE_FOLLOWER)
  const { userId } = props.follower
  const { data, refetch } = useQuery(CHECK_FOLLOW, {
    variables: { id: props.follower }
    // fetchPolicy: 'no-cache'
  })
  const sendNotifollow = async type => {
    const notificationId = +new Date()
    type === 'follow'
      ? createFollower({ variables: { id: props.follower } }).then(async () => {
          try {
            await firebase
              .database()
              .ref('notifications/' + userId + '/' + notificationId)
              .set({
                action: 'follow',
                reciever: userId,
                link: `/${me?._id}/info`,
                content: `${me?.firstname} đã bắt đầu theo dõi bạn`,
                seen: false,
                createdAt: +new Date()
              })
            props.refetchDataCountFollow()
          } catch (err) {
            console.log(err)
          }
          refetch()
        })
      : deleteFollower({ variables: { id: props.follower } }).then(() => {
          refetch()
          props.refetchDataCountFollow()
        })
  }
  return data?.checkFollow ? (
    window.innerWidth <= 600 ? (
      <HeartFilled
        style={{ marginLeft: 10, color: 'red', fontSize: 20 }}
        onClick={() => sendNotifollow('unfollow')}
      />
    ) : (
      <Popconfirm
        title="Bạn muốn bỏ theo dõi ?"
        onConfirm={() =>
          isAuth ? sendNotifollow('unfollow') : openLoginModal()
        }
        // onCancel={cancel}
        okText="Đồng ý"
        cancelText="Hủy"
      >
        <Button type="ghost" icon={<HeartFilled style={{ color: 'red' }} />}>
          Đã theo dõi
        </Button>
      </Popconfirm>
    )
  ) : window.innerWidth <= 600 ? (
    <HeartTwoTone
      style={{ marginLeft: 10, fontSize: 20 }}
      onClick={() => (isAuth ? sendNotifollow('follow') : openLoginModal())}
    />
  ) : (
    <Button
      type="ghost"
      icon={<HeartTwoTone />}
      onClick={() => {
        isAuth ? sendNotifollow('follow') : openLoginModal()
      }}
    >
      Theo dõi
    </Button>
  )
}
export default Follow
