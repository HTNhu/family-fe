import React, {
  useContext,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef
} from 'react'
import { Form, notification, Input, Upload, Button, Row, Col, Tag } from 'antd'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { IContext } from '@tools'
import { Editor } from '@components'
import UploadButton from '../uploadButton'
import { uploadImg, beforeUpload } from '@shared'
import * as handlebars from 'handlebars'
import postTemplate from '@assets/templates/post.html'
import { PlusOutlined } from '@ant-design/icons'

const UPDATE_POST = gql`
  mutation updatePost($postId: String, $updatePost: UpdatePostInput) {
    updatePost(postId: $postId, updatePost: $updatePost)
  }
`
const EditPostForm = forwardRef((props, ref) => {
  const { setConfirmLoading, handleCancel, postItem, refetch } = props
  const { me } = useContext(IContext)
  const keywordRef = useRef()
  const [loading, setLoading] = useState(false)
  const [editor, setEditor] = useState(null)
  const [keywords, setKeywords] = useState(postItem?.keywords)
  const [form] = Form.useForm()
  const [updatePost] = useMutation(UPDATE_POST)
  const [imageUrl, setImageUrl] = useState(postItem?.thumbnail)
  const [visibleInputKeyword, setVisibleInputKeyword] = useState(false)
  useImperativeHandle(ref, () => ({
    handleOk: () => {
      form.submit()
    }
  }))
  const submitUpdatePost = ({ content, title, thumbnail }) => {
    setConfirmLoading(true)
    const html = handlebars.compile(postTemplate)
    updatePost({
      variables: {
        postId: postItem?._id,
        updatePost: {
          title,
          content: html({
            title,
            author: `${me?.firstname} ${me?.lastname}`,
            community: postItem?.community?.name,
            content: `<div>${editor.getData()}</div>`,
            keywords
          }),
          keywords,
          thumbnail: imageUrl
        }
      }
    })
      .then(async ({ data }) => {
        if (data?.updatePost) {
          notification.success({ message: 'Ch???nh s???a b??i vi???t th??nh c??ng' })
          setConfirmLoading(false)
          await refetch()
          form.resetFields()
          handleCancel && handleCancel()
        }
      })
      .catch(({ graphQLErrors }) => {
        notification.error({
          message: graphQLErrors[0].message,
          placement: 'bottomRight'
        })
        setConfirmLoading(false)
      })
  }
  const handleUpload = async file => {
    setLoading(true)
    uploadImg(file).then(url => {
      setImageUrl(url)
      setLoading(false)
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
      onFinish={submitUpdatePost}
      initialValues={{
        title: postItem?.title,
        content: postItem?.content,
        // thumbnail: postItem?.thumbnail,
        community: postItem?.community?.name
      }}
    >
      {/* <Form.Item name="community" label="C???ng ?????ng">
        <Input disabled />
      </Form.Item> */}
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
          <Editor setEditor={setEditor} initialValue={postItem?.content} />
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

export default EditPostForm
