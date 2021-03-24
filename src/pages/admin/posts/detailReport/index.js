import React from 'react'
import { Button, Space, Drawer, List } from 'antd'
import { PostHaveGroup, PostNoGroup } from '@components'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import ItemReport from './itemReport'

export const GET_POST_BY_ID = gql`
  query postById($id: String) {
    postById(id: $id) {
      _id
      title
      content
      thumbnail
      keywords
      createdBy {
        _id
        firstname
        lastname
        avatar
        expert{
          isVerify
        }
      }
      createdAt
      community {
        _id
        name
        avatar
      }
    }
  }
`
const DetailReport = ({
  postData,
  visible,
  onClose,
  setSelectedRowKeys,
  selectedRowKeys
}) => {
  const { data } = useQuery(GET_POST_BY_ID, { variables: { id: postData?.id } })

  return (
    <Drawer
      title="Chi tiết bài viết report"
      visible={visible}
      onClose={onClose}
      closable={false}
      //   afterVisibleChange={visible => {
      //     if (!visible) {
      //       setCoverPhotoUrl(null)
      //       setImageUrl(null)
      //       setLoading(false)
      //       setLoadingCoverPhoto(false)
      //     }
      //     form.resetFields()
      //   }}
      width="90%"
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            onClick={() => {
              const a = [...selectedRowKeys, postData?.id]
              setSelectedRowKeys(a)
              onClose()
            }}
            type="primary"
            disabled={[...selectedRowKeys].findIndex(ids => ids === postData?.id) !== -1}
          >
            Chọn
          </Button>
        </Space>
      }
    >
      <div style={{ width: '100%', display: 'flex', height: '100%', overflowY: 'visible' }}>
        <div style={{ width: '50%' }}>
          <p>Chi tiết bài</p>
          {data &&
            (data?.postById?.community ? (
              <PostHaveGroup
                key={0}
                item={data?.postById}
                idx={0}
                showText={true}
              ></PostHaveGroup>
            ) : (
              <PostNoGroup showText={true} key={0} item={data?.postById} idx={0}></PostNoGroup>
            ))}
        </div>
        <div style={{ width: '40%', position: 'fixed', left: '55%' }}>
          <p>Danh sách báo cáo bài viết</p>
          {postData && (
            <List
              itemLayout="horizontal"
              dataSource={postData?.detail}
              renderItem={item => <ItemReport data={item}></ItemReport>}
            />
          )}
        </div>
      </div>
    </Drawer>
  )
}

export default DetailReport
