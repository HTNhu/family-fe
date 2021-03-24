/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from 'react'
import moment from 'moment'
import './Message.css'
import { ModalPreviewImg } from '@components'
import { CheckOutlined } from '@ant-design/icons'
import { IContext } from '@tools'

export default function Message(props) {
  const { data, isMine, startsSequence, endsSequence, showTimestamp } = props
  const { me } = useContext(IContext)
  const friendlyTimestamp = moment(data?.timestamp).locale('vi').format('llll')
  const [previewImg, setPreviewImg] = useState({
    isShow: false,
    imgSrc: ''
  })
  useEffect(() => {
    const ele = document.getElementsByClassName(
      `message-list-container  ${props.idChat}`
    )[0]
    if (ele) ele.scrollTop = ele.scrollTop === 30 ? 30 : ele.scrollHeight
  }, [props.isLast])

  return (
    <div
      className={[
        'message',
        `${isMine ? 'mine' : ''}`,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`
      ].join(' ')}
    >
      {showTimestamp && <div className="timestamp">{friendlyTimestamp}</div>}

      {data?.content?.img && (
        <div className="bubble-container">
          <div className="imgBubble">
            <img
              width="30%"
              src={data.content.img}
              onClick={() => {
                setPreviewImg({
                  isShow: true,
                  imgSrc: data.content.img
                })
              }}
            />
          </div>
          {/* {props.isLast && <CheckOutlined />} */}
        </div>
      )}
      {data?.content?.message.trim() && (
        <div className="bubble-container">
          <div>
            <div className="bubble" title={friendlyTimestamp}>
              {data.content.message}
            </div>
            {props.isLast && data.seen && data.author !== me?._id && (
              <div style={{ display: 'flex' }}>
                <CheckOutlined style={{ fontSize: 10, marginRight: 5 }} />{' '}
                <p style={{ fontSize: 10 }}>đã xem</p>
              </div>
            )}
          </div>
        </div>
      )}
      <ModalPreviewImg
        previewImg={previewImg}
        onCancel={() => setPreviewImg({ ...previewImg, isShow: false })}
      />
    </div>
  )
}
