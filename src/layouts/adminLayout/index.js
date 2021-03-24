import React, { useContext, useMemo } from 'react'
import { PageHeader, Dropdown, Menu, Avatar, Divider, Layout } from 'antd'
import {
  UserOutlined,
  LogoutOutlined,
  LeftOutlined,
  GlobalOutlined,
  ReadOutlined,
  AreaChartOutlined,
  UserAddOutlined
} from '@ant-design/icons'
import logoImgSrc from '@assets/images/logo.png'
import { withRouter } from 'react-router-dom'
import { IContext } from '@tools'

const AdminLayout = ({ children, history }) => {
  const { isSuper, logout, me } = useContext(IContext)
  const info = (
    <Menu>
      <Menu.Item disabled style={{}}>
        <Avatar src={logoImgSrc} />
        <span style={{ color: '#000', fontWeight: 'bold', marginLeft: '1em' }}>
          {me?.firstname ? `${me?.lastname} ${me?.firstname}` : 'Super Admin'}
        </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <UserOutlined />
        <span>Thông tin cá nhân</span>
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          logout()
          history.push('/login')
        }}
      >
        <LogoutOutlined />
        <span>Đăng xuất</span>
      </Menu.Item>
    </Menu>
  )

  const location = useMemo(() => history.location.pathname.split('/')[1], [
    history.location.pathname
  ])

  return (
    <>
      <PageHeader
        title="ADMIN AREA"
        onBack={() => history.goBack()}
        backIcon={<LeftOutlined />}
        extra={[
          <Dropdown
            key="0"
            overlay={info}
            trigger={['click']}
            placement="bottomRight"
          >
            <Avatar
              style={{ backgroundColor: 'rgba(0, 0, 0, .1)' }}
              src={logoImgSrc}
            />
          </Dropdown>
        ]}
        footer={<Divider style={{ margin: 0 }} />}
      />
      <Layout style={{ height: 'calc(100vh - 73px)' }}>
        <Layout.Sider>
          <Menu
            mode="inline"
            defaultSelectedKeys={[location]}
            style={{ height: '100%' }}
          >
            <Menu.Item
              key="dashboard"
              onClick={() => history.push('/dashboard')}
              icon={<AreaChartOutlined />}
            >
              Tổng quát
            </Menu.Item>
            <Menu.Item
              key="posts"
              onClick={() => history.push('/posts')}
              icon={<ReadOutlined />}
            >
              Bài viết
            </Menu.Item>
            <Menu.Item
              key="members"
              onClick={() => history.push('/members')}
              icon={<UserOutlined />}
            >
              Thành viên
            </Menu.Item>
            <Menu.Item
              key="experts"
              onClick={() => history.push('/awaitVerifyExpert')}
              icon={<UserAddOutlined />}
            >
              Chuyên gia
            </Menu.Item>
            <Menu.Item
              key="communities"
              onClick={() => history.push('/communities')}
              icon={<GlobalOutlined />}
            >
              Cộng đồng
            </Menu.Item>
            {isSuper && (
              <Menu.Item
                key="manage-admin"
                onClick={() => history.push('/manage-admin')}
                icon={<GlobalOutlined />}
              >
                Quản lý admin
              </Menu.Item>
            )}
          </Menu>
        </Layout.Sider>
        <Layout.Content style={{ overflow: 'auto', padding: '10px 25px' }}>
          {children}
        </Layout.Content>
      </Layout>
    </>
  )
}

export default withRouter(AdminLayout)
