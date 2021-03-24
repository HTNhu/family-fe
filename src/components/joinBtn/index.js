/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import { Button, Popconfirm } from 'antd'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { CHECK_IS_MEMBER, CREATE_AND_DELETE_MEMBER } from '@shared'
import { IContext } from '@tools'
import * as firebase from 'firebase/app'
function JoinBtn(props) {
  const { data, refetch } = useQuery(CHECK_IS_MEMBER, {
    variables: { id: props.id },
    skip: !props.id
  })
  const [membersCount, setMembersCount] = useState(0)
  useEffect(() => {
    firebase
      .database()
      .ref(`communities/${props.id.communityId}/membersCount`)
      .on('value', snapshot => {
        setMembersCount(snapshot.val())
      })
  })
  const { isAuth, openLoginModal } = useContext(IContext)
  const [createAndDelete] = useMutation(CREATE_AND_DELETE_MEMBER)

  const onHandleClick = async value => {
    await createAndDelete({ variables: { id: props.id } }).then(
      async ({ data }) => {
        await refetch()
        if (data?.createAndDeleteMember) {
          if (value.trim() === 'thamgia') {
            firebase
              .database()
              .ref(`communities/${props.id.communityId}/membersCount`)
              .set(membersCount + 1)
          }
          if (value === 'huy') {
            firebase
              .database()
              .ref(`communities/${props.id.communityId}/membersCount`)
              .set(membersCount - 1)
          }
        }
      }
    )
  }
  return data?.checkIsMember ? (
    <Popconfirm
      title="Bạn muốn bỏ tham gia nhóm"
      onConfirm={async () => (isAuth ? onHandleClick('huy') : openLoginModal())}
      okText="Đồng ý"
      cancelText="Hủy"
    >
      <Button style={{ backgroundColor: '#ccc', color: '#fff' }}>
        Đã tham gia
      </Button>
    </Popconfirm>
  ) : (
    <Button
      style={{ backgroundColor: 'rgb(0, 152, 218)', color: '#fff' }}
      onClick={() => (isAuth ? onHandleClick('thamgia') : openLoginModal())}
    >
      Tham gia
    </Button>
  )
}
export default JoinBtn
