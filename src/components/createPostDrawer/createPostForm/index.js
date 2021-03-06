import React, {
  useRef,
  useContext,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react'
import {
  Form,
  notification,
  Select,
  Input,
  Upload,
  Button,
  Row,
  Col,
  Tag
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import * as handlebars from 'handlebars'
import { IContext } from '@tools'
import { uploadImg, beforeUpload, GET_COMMUNITIES_BY_USER } from '@shared'
import postTemplate from '@assets/templates/post.html'
import { Editor, UploadButton } from '@components'
import * as firebase from 'firebase/app'
const CREATE_POST = gql`
  mutation createPost($newPost: NewPost) {
    createPost(newPost: $newPost) {
      _id
      title
    }
  }
`
const GET_SUM_FOLLOWER_BY_USER = gql`
  query getFollowerByUser($userId: String) {
    getFollowerByUser(userId: $userId) {
      _id {
        userId
      }
      follower {
        _id
        firstname
        lastname
      }
    }
  }
`

const CreatePostForm = forwardRef((props, ref) => {
  const { setConfirmLoading, handleCancel, data, refetch } = props
  const keywordRef = useRef()
  const { me } = useContext(IContext)
  const { data: dataCountFollow } = useQuery(GET_SUM_FOLLOWER_BY_USER, {
    variables: { userId: me?._id },
    fetchPolicy: 'no-cache'
  })
  const { data: dataCommunities, loading: loadingCommunities } = useQuery(
    GET_COMMUNITIES_BY_USER,
    {
      variables: { userId: me?._id },
      fetchPolicy: 'no-cache',
      skip: !me?._id
    }
  )
  const [visibleInputKeyword, setVisibleInputKeyword] = useState(false)
  const [editor, setEditor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [keywords, setKeywords] = useState([])
  const [form] = Form.useForm()
  const [createPost] = useMutation(CREATE_POST)
  useImperativeHandle(ref, () => ({
    handleOk: () => {
      form.submit()
    },
    handleAfterClose: () => {
      form.resetFields()
      setLoading(false)
      setImageUrl(null)
      setVisibleInputKeyword(false)
      setKeywords([])
    }
  }))

  const handleUpload = async file => {
    setLoading(true)
    uploadImg(file).then(url => {
      setImageUrl(url)
      setLoading(false)
    })
  }
  const notifyToUser = (item, postId) => {
    try {
      item?._id !== me?._id &&
        firebase
          .database()
          .ref(`notifications/${item?._id}/${+new Date()}`)
          .set({
            action: 'post',
            reciever: item?._id,
            link: `/post-detail/${postId}`,
            content: `${me?.firstname} ???? ????ng b??i vi???t m???i`,
            seen: false,
            createdAt: +new Date()
          })
    } catch (err) {
      console.log(err)
    }
  }
  const submitCreatePost = ({ title, communityId }) => {
    setConfirmLoading(true)
    const html = handlebars.compile(postTemplate)
    createPost({
      variables: {
        newPost: {
          title,
          communityId: communityId?.value,
          content: html({
            title,
            author: `${me?.firstname} ${me?.lastname}`,
            community: communityId?.label,
            content: `<div>${editor.getData()}</div>`,
            keywords
          }),
          thumbnail: imageUrl,
          keywords
        }
      }
    })
      .then(async ({ data }) => {
        if (data?.createPost) {
          firebase
            .database()
            .ref(`posts/${data?.createPost?._id}`)
            .set({
              createdAt: +new Date()
            })
          communityId?.value &&
            firebase
              .database()
              .ref(`communities/${communityId?.value}/postsCount`)
              .once('value', snapshot => {
                firebase
                  .database()
                  .ref(`communities/${communityId?.value}`)
                  .update({ postsCount: snapshot.val() + 1 })
              })
          await refetch()
          notification.success({ message: 'T???o b??i vi???t th??nh c??ng' })
          dataCountFollow?.getFollowerByUser?.map(item => {
            notifyToUser(item.follower, data?.createPost?._id)
          })
          setConfirmLoading(false)
          handleCancel()
        }
      })
      .catch(err => {
        const { graphQLErrors } = err
        console.log(err)
        notification.error({
          message: graphQLErrors[0].message,
          placement: 'bottomRight'
        })
        setConfirmLoading(false)
      })
  }

  const addKeywords = e => {
    const keyword = e.target.value
    if (keyword && !keywords.includes(keyword.trim())) {
      setKeywords([...keywords, keyword.trim()])
      setVisibleInputKeyword(false)
      form.resetFields(['keyword'])
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={submitCreatePost}
      initialValues={{
        communityId: data?._id
          ? { key: data?._id, value: data?._id, label: data?.name }
          : undefined
      }}
    >
      {data !== null && (
        <Form.Item name="communityId" label="C???ng ?????ng">
          <Select
            disabled={!!data}
            allowClear
            loading={loadingCommunities}
            placeholder="Ch???n c???ng ?????ng"
            showArrow={false}
            showSearch
            labelInValue
            filterOption={(inputValue, option) =>
              option.label
                .toLocaleLowerCase()
                .indexOf(inputValue.toLowerCase()) !== -1
            }
          >
            {dataCommunities?.getCommunitiesByUser?.map(({ community }) => (
              <Select.Option key={community._id} value={community._id}>
                {community.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
      <Form.Item
        label="Ti??u ?????"
        name="title"
        rules={[
          { required: true, message: 'Vui l??ng nh???p ti??u ????? b??i vi???t' },
          { min: 5, message: 'Ti??u ????? qu?? ng???n' },
          { max: 500, message: 'Ti??u ????? qu?? d??i' }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Thumbnail">
        <div style={{ width: 'auto' }}>
          <Upload
            action={handleUpload}
            listType="picture-card"
            beforeUpload={beforeUpload}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              <UploadButton loading={loading} />
            )}
          </Upload>
        </div>
        {imageUrl && (
          <Button danger onClick={() => setImageUrl(null)}>
            X??a ???nh
          </Button>
        )}
      </Form.Item>
      <Form.Item
        required
        label="N???i dung"
        name="content"
        rules={[
          {
            validator: () => {
              if (!editor.getData()) {
                return Promise.reject('N???i dung kh??ng ???????c ????? tr???ng')
              }
              return Promise.resolve()
            }
          }
        ]}
      >
        <div style={{ width: '100%' }}>
          <Editor setEditor={setEditor} />
        </div>
      </Form.Item>
      <Form.Item
        name="keyword"
        label="T??? kh??a"
        required
        rules={[
          {
            validator: (_, value) => {
              if (!value && keywords.length === 0) {
                return Promise.reject(
                  'Th??m t??? kh??a ????? gi??p b??i vi???t c???a b???n d??? d??ng ???????c m???i ng?????i t??m th???y'
                )
              }
              if (value && keywords.includes(value.trim())) {
                return Promise.reject('T??? kh??a n??y ???? c??')
              }
              return Promise.resolve()
            }
          }
        ]}
      >
        <Row style={{ width: '100%' }}>
          <Col span={24}>
            {keywords.map((keyword, index) => (
              <Tag
                key={index}
                style={{ marginBottom: 5 }}
                closable
                onClose={e => {
                  e.preventDefault()
                  setKeywords(keywords.filter(key => key !== keyword))
                }}
              >
                {keyword}
              </Tag>
            ))}
          </Col>
          <Col span={24}>
            {visibleInputKeyword ? (
              <Input
                ref={keywordRef}
                placeholder="Nh???p t??? kh??a"
                onPressEnter={addKeywords}
                onBlur={addKeywords}
                autoFocus
              />
            ) : (
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  setVisibleInputKeyword(true)
                }}
              >
                Th??m t??? kh??a
              </Button>
            )}
          </Col>
        </Row>
      </Form.Item>
    </Form>
  )
})

export default CreatePostForm
