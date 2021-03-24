import React, { useContext, useRef, useEffect, useState, useMemo } from 'react'
import { Card, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import * as firebase from 'firebase/app'
import { IContext } from '@tools'
import ModalSeminar from './modalSeminar'
import SeminarDetail from './seminarDetail'

const GET_SEMINARS = gql`
  query seminars {
    seminars {
      _id
      title
      description
      startAt
      createdBy {
        _id
        firstname
        lastname
        avatar
        expert {
          jobTitle
        }
      }
    }
  }
`

function index() {
  const { me } = useContext(IContext)
  const modalRef = useRef()
  const { data, refetch } = useQuery(GET_SEMINARS)
  const [firebaseSeminars, setFirebaseSeminars] = useState([])
  const [senimarData, setSenimarData] = useState(null)
  useEffect(() => {
    firebase
      .database()
      .ref('seminars')
      .on('value', snapshot => {
        snapshot.val() && setFirebaseSeminars(Object.values(snapshot.val()))
      })
  }, [])
  const seminars = useMemo(() => {
    if (data?.seminars && firebaseSeminars) {
      const startSeminarIds = firebaseSeminars
        .filter(v => v.isStart)
        .map(v => v._id)
      const endSeminarIds = firebaseSeminars
        .filter(v => !v.isStart)
        .map(v => v._id)
      const excludeIndex = []
      const startSeminars = data?.seminars?.filter((v, idx) => {
        if (startSeminarIds.includes(v._id)) {
          excludeIndex.push(idx)
          return true
        }
        return false
      })
      const endSeminars = data?.seminars?.filter((v, idx) => {
        if (endSeminarIds.includes(v._id)) {
          excludeIndex.push(idx)
          return true
        }
        return false
      })
      return {
        startSeminars,
        endSeminars,
        upcomingSeminars: data?.seminars?.filter(
          (v, idx) => !excludeIndex.includes(idx)
        )
      }
    }
  }, [firebaseSeminars, data?.seminars])
  const openModal = dat => {
    modalRef.current?.openModal()
    setSenimarData(dat)
  }
  return (
    <Card
      title="Hội thảo"
      extra={
        me?.expert?.isVerify ? (
          <Button
            icon={<PlusOutlined />}
            onClick={() => openModal(null)}
          >
            Tạo hội thảo
          </Button>
        ) : null
      }
    >
      <Card type="inner" title="Đang diễn ra">
        {seminars?.startSeminars?.map(v => (
          <SeminarDetail state='start' key={v._id} me={me} refetch={refetch} seminarData={v} openEditModal={() => openModal(v)} />
        ))}
      </Card>
      <Card style={{ marginTop: 16 }} type="inner" title="Sắp tới">
        {seminars?.upcomingSeminars?.map(v => (
          <SeminarDetail state='upcoming' key={v._id} me={me} refetch={refetch} seminarData={v} openEditModal={() => openModal(v)} />
        ))}
      </Card>
      <Card style={{ marginTop: 16 }} type="inner" title="Đã kết thúc">
        {seminars?.endSeminars?.map(v => (
          <SeminarDetail state='end' key={v._id} me={me} refetch={refetch} seminarData={v} openEditModal={() => openModal(v)} />
        ))}
      </Card>
      <ModalSeminar ref={modalRef} refetchSeminars={refetch} seminarData={senimarData} />
    </Card>
  )
}

export default index
