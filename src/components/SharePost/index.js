/* eslint-disable no-undef */
/* eslint-disable one-var */
/* eslint-disable eol-last */
import React, { useState } from 'react'
import { Menu, Dropdown, Tooltip } from 'antd'
import {
  ShareAltOutlined,
  FacebookFilled,
  LinkOutlined
} from '@ant-design/icons'
import { SdkUtils } from '@utils'
function SharePost(props) {
  const { post } = props
  const [title, setTitle] = useState('Nhấp để  copy link')
  const copyLink = () => {
    var copyinput = document.createElement('input')
    copyinput.value = `${window.location.origin}/post-detail/${post?._id}`
    document.body.appendChild(copyinput)
    copyinput.select()
    copyinput.setSelectionRange(0, 99999)
    document.execCommand('Copy')
    copyinput.remove()
    setTitle('Đã copy link')
  }
  const menu = (
    <Menu>
      <Menu.Item class="btn btn-success clearfix" key="0" onClick={() => SdkUtils.shareFB(post)} >
        <FacebookFilled />
        Facebook
      </Menu.Item>
      <Menu.Item key="1" onClick={() => copyLink()}>
        <Tooltip title={title}>
          <LinkOutlined />
          Copy link chia sẻ
        </Tooltip>
      </Menu.Item>
    </Menu>
  )
  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      placement="bottomRight"
      onClick={() => setTitle('Nhấp để  copy link')}
    >
      <ShareAltOutlined key="share" />
    </Dropdown>
  )
}
export default SharePost
