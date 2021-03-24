/* eslint-disable no-prototype-builtins */
import React, { useMemo, useContext } from 'react'
import { Row, Col, Grid, Result } from 'antd'
import Comments from './comments'
import gql from 'graphql-tag'
import OwnSeminar from './ownSeminar'
import { useQuery } from '@apollo/react-hooks'
import { withRouter } from 'react-router-dom'
import { IContext } from '@tools'
import JoinSenimar from './joinSeminar'
import { LoadingOutlined } from '@ant-design/icons'

const GET_SEMINAR = gql`
  query seminar($_id: ID) {
    seminar(_id: $_id) {
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

function index({ match }) {
  const { me } = useContext(IContext)
  const screens = Grid.useBreakpoint()
  const breakPoint = useMemo(
    () =>
      Object.entries(screens).filter(v => !v[1] && v[0] === 'lg').length === 1,
    [screens]
  )
  const { loading, data } = useQuery(GET_SEMINAR, {
    skip: !match.params.idSeminar,
    variables: {
      _id: match.params.idSeminar
    }
  })
  const isOwner = useMemo(() => {
    if (data?.seminar && me) {
      return me?._id === data?.seminar?.createdBy?._id
    }
  }, [data?.seminar, me])
  if (loading) {
    return (
      <Result
        icon={<LoadingOutlined />}
        title="Loading..."
      />
    )
  }
  return (
    <Row>
      <Col
        style={{ height: breakPoint ? '50vh' : '100vh', background: '#000' }}
        xs={24}
        lg={18}
      >
        {isOwner ? <OwnSeminar idSeminar={data?.seminar?._id} seminarTitle={data?.seminar?.title} /> : <JoinSenimar idSeminar={data?.seminar?._id} />}
      </Col>
      <Col xs={24} lg={6}>
        <Comments breakPoint={breakPoint} dataSeminar={data?.seminar} me={me} />
      </Col>
    </Row>
  )
}

export default withRouter(index)
