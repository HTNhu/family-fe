import React, { useMemo } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import FullEditor from 'ckeditor5-build-full'
import { CustomUploadAdapterPlugin } from './customAdapter'
import { Grid } from 'antd'

const index = ({ setEditor, initialValue }) => {
  const mobileToolbar = [
    'heading',
    '|',
    'bold',
    'italic',
    'underline',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'alignment',
    '|',
    'link',
    'imageUpload',
    'mediaEmbed'
  ]
  const screens = Grid.useBreakpoint()
  const isBreak = useMemo(
    () =>
      Object.entries(screens).filter(v => !v[1] && v[0] === 'md').length === 1,
    [screens]
  )
  if (Object.keys(screens).length === 0) {
    return null
  }

  return (
    <CKEditor
      editor={FullEditor}
      onInit={editor => setEditor(editor)}
      data={initialValue || ''}
      config={{
        ...(isBreak ? { toolbar: mobileToolbar } : {}),
        extraPlugins: [CustomUploadAdapterPlugin]
      }}
    />
  )
}

export default index
