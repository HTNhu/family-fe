import { CloudinaryImageUploadAdapter } from 'ckeditor-cloudinary-uploader-adapter'

const CustomUploadAdapterPlugin = (editor) => {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new CloudinaryImageUploadAdapter(
      loader,
      process.env.CLOUDINARY_NAME,
      process.env.CLOUDINARY_UPLOAD_PRESET
    )
  }
}

export { CustomUploadAdapterPlugin }
