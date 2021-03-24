import { message, notification } from 'antd'
const CLOUDINARY_UPLOAD_PRESET =
  process.env.CLOUDINARY_UPLOAD_PRESET || 'graduation-pj'
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || 'nhuht'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`

export const beforeUpload = file => {
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

export const uploadImg = async file => {
  // eslint-disable-next-line promise/param-names
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load', async () => {
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file: reader.result,
          upload_preset: CLOUDINARY_UPLOAD_PRESET
        })
      }
      const upload = await fetch(CLOUDINARY_UPLOAD_URL, data).then(res =>
        res.json()
      )
      resolve(upload.secure_url)
    })
    reader.readAsDataURL(file)
  })
}
