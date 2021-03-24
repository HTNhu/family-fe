/* eslint-disable quote-props */
/* eslint-disable indent */
/* eslint-disable handle-callback-err */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Upload, Popover, notification, message, Space, Spin } from 'antd'
import {
  CloseCircleFilled,
  FileImageOutlined,
  SmileOutlined
} from '@ant-design/icons'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import './index.scss'
import { MentionsInput, Mention } from 'react-mentions'
import { uploadImg } from '@shared'
import ModalPreviewImg from '../modalPreviewImg'

function InputCustomize(props) {
  const { mentions, replyAuthor, idElement, onAdd, placeholder } = props
  const mentionData = []
  mentions &&
    mentions.map((item, idx) => {
      mentionData.push({
        id: item.id,
        display: item.name
      })
    })
  const [arrMentions, setArrMentions] = useState([])
  const [emoji, setEmoji] = useState({
    showEmoji: false,
    chosenEmoji: null
  })
  const [image, setImage] = useState({
    loading: false,
    srcImg: ''
  })

  const [text, setText] = useState('')
  const [plainText, setPlainText] = useState('')
  const [previewImg, setPreviewImg] = useState(false)
  useEffect(() => {
    setText(
      replyAuthor
        ? `<a href='${window.location.origin}/${replyAuthor.id}/info'>${replyAuthor.name}</a> `
        : ''
    )
    replyAuthor && document.getElementById(`input-custom-${idElement}`).focus()
    // onAdd && onAdd([{ id: replyAuthor.id, display: replyAuthor.name }])
  }, [replyAuthor])
  // const { isBroken } = useContext(MainContext)
  const deleteImg = () => {
    setImage({ ...image, srcImg: '' })
  }
  const addEmoji = e => {
    const sym = e.unified.split('-')
    const codesArray = []
    sym.forEach(el => codesArray.push('0x' + el))
    const emoji = String.fromCodePoint(...codesArray)
    setText(text + emoji)
  }
  function beforeUpload(file) {
    // const isJpgOrPng =
    //   heading.includes('89504E470D0A1A0A') || heading.includes('FFD8FFDB')
    // if (!isJpgOrPng) {
    //   message.error('You can only upload JPG/PNG file!')
    //   return false
    // }
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      notification.error({ message: 'Image must smaller than 2MB!' })
    }
    return isJpgOrPng && isLt2M
  }
  const handleUpload = file => {
    setImage({ ...image, loading: true })
    uploadImg(file).then(url => {
      setImage({
        srcImg: url,
        loading: false
      })
      document.getElementById(`input-custom-${idElement}`).focus()
    })
  }
  const escapeHtml = text => {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }
    return text.replace(/[&<>"']/g, function (m) {
      return map[m]
    })
  }

  const handleSubmit = event => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault()
      if (text.trim() || image.srcImg) {
        let newPlain = escapeHtml(plainText)
        arrMentions.map(mention => {
          newPlain = newPlain.replace(
            mention.display,
            `<a href='${window.location.origin}/${mention.id}/info'>${mention.display}</a>`
          )
        })
        props.onSubmit(newPlain, image.srcImg)
        setText('')
        setImage({ ...image, srcImg: '' })
      }
    }
  }

  return (
    <div style={{ width: '100%' }}>
      {/* <div> */}

      <Spin spinning={image.loading} size="small" style={{ padding: 10 }} />

      {image.srcImg && (
        <div style={{ display: 'flex', overflowX: 'auto' }}>
          <div
            onClick={() =>
              setPreviewImg({
                isShow: true,
                imgSrc: image.srcImg
              })
            }
            className="img-upload"
            style={{
              display: 'flex',
              height: 65,
              width: 70,
              margin: '5px 0 0 5px'
            }}
          >
            <img
              style={{ height: 60, width: 60, objectFit: 'cover' }}
              src={image.srcImg}
            />
            <div className="delete-img">
              <CloseCircleFilled onClick={() => deleteImg()} />
            </div>
          </div>
          {/* </div> */}
        </div>
      )}
      <div className="input-custome">
        <MentionsInput
          // defaultValue={replyAuthor && replyAuthor }
          style={{ maxWidth: '100%', flex: '1 1 auto' }}
          onFocus={() => {
            const a = document.getElementsByClassName(
              `contentMess-box ${idElement}`
            )[0]
            a && a.classList.add('focus')
          }}
          onBlur={() => {
            const a = document.getElementsByClassName(
              `contentMess-box ${idElement}`
            )[0]
            a && a.classList.remove('focus')
          }}
          id={`input-custom-${idElement}`}
          className="textMention"
          placeholder={placeholder}
          // autoSize={{ minRows: 1, maxRows: 3 }}
          onChange={(event, newValue, newPlainTextValue, mentions) => {
            setText(newValue)
            setPlainText(newPlainTextValue)
            setArrMentions(mentions)
            onAdd && onAdd(arrMentions)
          }}
          value={text}
          onKeyUp={event => {
            handleSubmit(event)
          }}
          allowSuggestionsAboveCursor
          allowSpaceInQuery
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            markup={`<a href='${window.location.origin}/__id__/info'>__display__</a>`}
            data={mentionData}
            className="textMention__mention"
          />
        </MentionsInput>
        {/* {!isBroken && ( */}
        <Space className="menu-input">
          <Popover
            overlayStyle={{ position: 'absolute' }}
            placement="topRight"
            title={
              <Picker
                showPreview={false}
                showSkinTones={false}
                sheetSize={16}
                onSelect={e => addEmoji(e)}
              />
            }
            trigger="click"
            visible={emoji.showEmoji}
            destroyTooltipOnHide
            popupVisible
            onVisibleChange={() =>
              setEmoji({ ...emoji, showEmoji: !emoji.showEmoji })
            }
          >
            <SmileOutlined
              style={{ color: '#bbb', fontSize: 16 }}
              onClick={() => setEmoji({ ...setEmoji, showEmoji: true })}
            />
          </Popover>
          <Upload action={handleUpload} beforeUpload={beforeUpload}>
            <FileImageOutlined style={{ color: '#bbb', fontSize: 16 }} />
          </Upload>
        </Space>
        {/* )} */}
      </div>
      <ModalPreviewImg
        previewImg={previewImg}
        onCancel={() => setPreviewImg({ ...previewImg, isShow: false })}
      />
    </div>
  )
}
export default InputCustomize
