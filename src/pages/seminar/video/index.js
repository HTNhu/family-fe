import React, { useEffect, forwardRef } from 'react'

const Video = forwardRef((props, videoRef) => {
  const { videoStream } = props
  useEffect(() => {
    if (videoStream) {
      videoRef.current.srcObject = videoStream
    }
  }, [videoStream])
  return (
    <video ref={videoRef} style={{ width: '100%', height: '100%' }} autoPlay />
  )
})

export default Video
