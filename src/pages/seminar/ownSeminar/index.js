/* eslint-disable no-prototype-builtins */
import React, { useState, useEffect, useRef } from 'react'
import { Button, Space, Tooltip, message, Modal } from 'antd'
import {
  AudioOutlined,
  ShareAltOutlined,
  CameraOutlined,
  AudioMutedOutlined,
  StopOutlined,
  LogoutOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import * as firebase from 'firebase/app'
import { configRTCPeerConnection } from '@constants'
import Video from '../video'

const OwnSeminar = ({ idSeminar, seminarTitle }) => {
  const [participant, setParticipant] = useState({})
  const [participants, setParticipants] = useState({})
  const [localStream, setLocalStream] = useState(null)
  const [currentStream, setCurrentStream] = useState(null)
  const [videoTrack, setVideoTrack] = useState(null)
  const [videoTracks, setVideoTracks] = useState([])
  const [audioEnable, setAudioEnable] = useState(true)
  const [videoEnable, setVideoEnable] = useState(true)
  const [mediaRecorder, setMediaRecorder] = useState(null)

  const videoRef = useRef()

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream)
        setCurrentStream(stream)
        firebase
          .database()
          .ref(`seminars/${idSeminar}`)
          .set({ _id: idSeminar, isStart: true })
        firebase
          .database()
          .ref(`seminars/${idSeminar}/participants`)
          .on('child_added', snapshot => {
            const { _id, fullName, offer } = snapshot.val()
            if (!_id) {
              firebase
                .database()
                .ref(`seminars/${idSeminar}/participants/${_id}`)
                .remove()
            } else if (snapshot.val()) {
              const pc = new RTCPeerConnection(configRTCPeerConnection)
              if (stream) {
                setVideoTrack(pc.addTrack(stream.getVideoTracks()[0], stream))
                pc.addTrack(stream.getAudioTracks()[0], stream)
              }
              setParticipant({ _id, fullName, offer, pc })
            }
          })
      })
      .catch(err => console.log(err))

    firebase
      .database()
      .ref(`seminars/${idSeminar}/isStart`)
      .onDisconnect()
      .set(false)
  }, [])

  useEffect(() => {
    const id = participant?._id
    if (participant && !!id && !participants.hasOwnProperty(id)) {
      const { _id, fullName, offer, pc } = participant
      pc.onicecandidate = e => {
        if (e.candidate) {
          firebase
            .database()
            .ref(`seminars/${idSeminar}/participants/${_id}/candidate`)
            .push(JSON.stringify(e.candidate))
        }
      }
      firebase
        .database()
        .ref(`seminars/${idSeminar}/participants/${_id}/joinCandidate`)
        .on('child_added', snap => {
          const candidate = JSON.parse(snap.val())
          if (candidate) {
            pc.addIceCandidate(new RTCIceCandidate(candidate))
          }
        })
      pc.setRemoteDescription(
        new RTCSessionDescription(JSON.parse(offer))
      ).then(() => {
        pc.createAnswer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        }).then(answerSdp => {
          pc.setLocalDescription(answerSdp)
          firebase
            .database()
            .ref(`seminars/${idSeminar}/participants/${_id}/answer`)
            .set(JSON.stringify(answerSdp))
        })
        message.info(`${fullName} tham dự hội thảo`)
      })
      setParticipants({ ...participants, [_id]: pc })
    }
  }, [participant])

  useEffect(() => {
    if (videoTrack) {
      videoTrack.replaceTrack(currentStream.getVideoTracks()[0], currentStream)
      setVideoTracks([...videoTracks, videoTrack])
    }
  }, [videoTrack])

  useEffect(() => {
    videoTracks.map(track => {
      track.replaceTrack(currentStream.getVideoTracks()[0])
    })
  }, [currentStream])

  useEffect(() => {
    firebase
      .database()
      .ref(`seminars/${idSeminar}/participants`)
      .on('child_removed', snapshot => {
        const { _id } = snapshot.val()
        if (!!_id && participants.hasOwnProperty(_id)) {
          const cloneParts = { ...participants }
          // cloneParts[_id].close()
          delete cloneParts[_id]
          setParticipants(cloneParts)
        }
      })
  })

  const handleShareScreen = async () => {
    let streamDisplay
    if (navigator.getDisplayMedia) {
      streamDisplay = await navigator.getDisplayMedia({ video: true })
    } else if (navigator.mediaDevices.getDisplayMedia) {
      streamDisplay = await navigator.mediaDevices.getDisplayMedia({
        video: true
      })
    } else {
      streamDisplay = await navigator.mediaDevices.getUserMedia({
        video: { mediaSource: 'screen' }
      })
    }
    if (streamDisplay) {
      setCurrentStream(streamDisplay)
    }
    streamDisplay.addEventListener('inactive', e => {
      setCurrentStream(localStream)
    })
  }

  const handleRecordStream = async () => {
    let newMediaRecorder
    const recordedBlobs = []
    let options = { mimeType: 'video/webm;codecs=vp9,opus' }
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`)
      options = { mimeType: 'video/webm;codecs=vp8,opus' }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`)
        options = { mimeType: 'video/webm' }
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error(`${options.mimeType} is not supported`)
          options = { mimeType: '' }
        }
      }
    }
    try {
      const stream = videoRef?.current?.captureStream()
      stream.addTrack(localStream.getAudioTracks()[0])
      newMediaRecorder = new MediaRecorder(stream, options)
    } catch (e) {
      console.error('Exception while creating MediaRecorder:', e)
    }
    newMediaRecorder.onstop = () => {
      dowloadStream(recordedBlobs)
    }
    newMediaRecorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) {
        recordedBlobs.push(e.data)
      }
    }
    newMediaRecorder.start()
    setMediaRecorder(newMediaRecorder)
  }

  const handleStopRecordStream = () => {
    mediaRecorder.stop()
    setMediaRecorder(null)
  }

  const dowloadStream = recordedBlobs => {
    const blob = new Blob(recordedBlobs, { type: 'video/webm' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = `${seminarTitle}.webm`
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 100)
  }

  return (
    <div
      style={{
        height: '100%',
        position: 'relative',
        border: mediaRecorder ? '2px solid red' : 'none'
      }}
    >
      <Video ref={videoRef} videoStream={currentStream} />
      <Space
        size="large"
        style={{
          position: 'absolute',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          bottom: '5%'
        }}
      >
        <Tooltip title={videoEnable ? 'Tắt camera' : 'Mở camera'}>
          <Button
            icon={videoEnable ? <CameraOutlined /> : <StopOutlined />}
            shape="circle-outline"
            ghost
            onClick={() => {
              localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0]
                .enabled
              setVideoEnable(localStream.getVideoTracks()[0].enabled)
            }}
          />
        </Tooltip>
        <Tooltip title={audioEnable ? 'Tắt micro' : 'Mở micro'}>
          <Button
            icon={audioEnable ? <AudioOutlined /> : <AudioMutedOutlined />}
            shape="circle-outline"
            ghost
            onClick={() => {
              localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0]
                .enabled
              setAudioEnable(localStream.getAudioTracks()[0].enabled)
            }}
          />
        </Tooltip>
        <Tooltip title="Chia sẻ màn hình">
          <Button
            icon={<ShareAltOutlined />}
            shape="circle-outline"
            ghost
            onClick={handleShareScreen}
          />
        </Tooltip>
        <Tooltip title={mediaRecorder ? 'Dừng ghi màn hình' : 'Ghi màn hình'}>
          <Button
            icon={
              mediaRecorder ? <PauseCircleOutlined /> : <PlayCircleOutlined />
            }
            shape="circle-outline"
            ghost
            onClick={
              mediaRecorder ? handleStopRecordStream : handleRecordStream
            }
          />
        </Tooltip>
        <Tooltip title="Thoát">
          <Button
            onClick={() => {
              if (mediaRecorder) {
                Modal.confirm({
                  icon: <ExclamationCircleOutlined />,
                  title: 'Thoát',
                  centered: true,
                  content:
                    'Bạn chưa dừng ghi màn hình. Nếu bạn thoát sẽ không lưu video của hội thảo. Bạn có chắc chắn muốn thoát?',
                  okText: 'Có',
                  cancelText: 'Không',
                  onOk: () => {
                    window.close()
                  }
                })
              } else {
                Modal.confirm({
                  icon: <ExclamationCircleOutlined />,
                  title: 'Thoát',
                  centered: true,
                  content: 'Bạn có chắc chắn muốn thoát?',
                  okText: 'Có',
                  cancelText: 'Không',
                  onOk: () => {
                    window.close()
                  }
                })
              }
            }}
            icon={<LogoutOutlined />}
            shape="circle-outline"
            ghost
          />
        </Tooltip>
      </Space>
    </div>
  )
}

export default OwnSeminar
