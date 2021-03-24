/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect, useRef, useMemo } from 'react'
import {
  Layout,
  Menu,
  Input,
  Avatar,
  Dropdown,
  Typography,
  Button,
  Tooltip,
  Modal,
  Drawer,
  Row,
  Col,
  Badge
} from 'antd'
import {
  BellOutlined,
  CaretDownOutlined,
  SearchOutlined,
  MessageTwoTone,
  InfoCircleTwoTone,
  FileTextTwoTone,
  LogoutOutlined,
  BookTwoTone,
  HeartTwoTone,
  YoutubeOutlined,
  HomeOutlined,
  TeamOutlined,
  LoginOutlined,
  MessageOutlined
} from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import * as firebase from 'firebase/app'
import { Logo, HighLightGroup, Noti, Login } from '@components'
import './mainlayout.scss'
import { IContext } from '@tools'
import ConversationList from '@pages/myMessenger/ConversationList'
import Messboxes from './messBoxes'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

const { Header, Content, Sider } = Layout

const SEARCH_POSTS = gql`
  mutation searchAllPosts($query: String) {
    searchAllPosts(query: $query) {
      _id
      title
      thumbnail
      keywords
      isActive
      content
      community {
        _id
        name
        avatar
      }
      createdBy {
        _id
        firstname
        lastname
        avatar
      }
      createdAt
      updatedAt
      deletedBy {
        _id
        firstname
        lastname
        avatar
      }
      updatedBy {
        _id
        firstname
        lastname
        avatar
      }
      deletedAt
    }
  }
`

export const MainContext = React.createContext(null)
const index = ({ children }) => {
  const { logout, me, isAuth, showLogin, closeLoginModal } = useContext(
    IContext
  )
  const [dataCount, setDataCount] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    firebase
      .database()
      .ref('communities')
      .on('value', snapshot => {
        const temp = snapshot.val()
          ? Object.keys(snapshot.val()).map(key => ({
              ...snapshot.val()[key],
              id: key
            }))
          : []
        setDataCount(temp)
        setLoading(false)
      })
  }, [])
  const [isBroken, setIsBroken] = useState(false)
  const [showCommunities, setShowCommunities] = useState(false)
  const messBoxesRef = useRef()
  const history = useHistory()
  useEffect(() => {
    isBroken && getNotification()
  }, [isBroken])
  const getNotification = () => {
    let temp
    firebase
      .database()
      .ref('notifications/' + me?._id)
      .orderByKey()
      .limitToLast(50)
      .on('value', snapshot => {
        temp = snapshot.val()
          ? Object.keys(snapshot.val()).map(key => ({
              ...snapshot.val()[key],
              id: key
            }))
          : []

        setNotifications(temp.reverse())
      })
  }
  const location = useMemo(() => {
    return history.location.pathname.split('/')[1]
  }, [history.location.pathname])
  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => history.push(`/${me?._id}/info`)}>
        <InfoCircleTwoTone /> Thông tin cá nhân
      </Menu.Item>
      <Menu.Item key="2" onClick={() => history.push(`/${me?._id}/myposts`)}>
        <FileTextTwoTone /> Bài viết của tôi
      </Menu.Item>
      <Menu.Item key="3" onClick={() => history.push(`/${me?._id}/savedposts`)}>
        <BookTwoTone /> Bài viết đã lưu
      </Menu.Item>
      <Menu.Item
        key="4"
        onClick={() => history.push(`/${me?._id}/joinedGroup`)}
      >
        <HeartTwoTone /> Cộng đồng đã tham gia
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="5" onClick={logout}>
        <LogoutOutlined /> Đăng xuất
      </Menu.Item>
    </Menu>
  )

  const [searchAllPosts] = useMutation(SEARCH_POSTS)
  const handleSearch = e => {
    e.preventDefault()
    const query = e.target.value
    searchAllPosts({
      variables: {
        query
      }
    })
      .then(({ data }) => {
        history.push('/search-results', {
          results: data?.searchAllPosts,
          query
        })
      })
      .catch(() => {})
  }

  return (
    <Layout>
      <Header
        style={{
          boxShadow: '0 1px 8px #f0f1f2',
          backgroundColor: 'lightskyblue',
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 10
        }}
      >
        <div
          style={{
            width: isBroken ? '100%' : '60%',
            display: 'flex',
            margin: '0 auto',
            justifyContent: 'space-between'
          }}
        >
          <div
            id="header-left"
            style={{
              width: isBroken ? '80%' : '62%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <Logo
              isBroken={isBroken}
              size="medium"
              onClick={() => {
                // refetchPosts()
                history.push('/homepage')
              }}
            />
            {!isBroken ? (
              <Input
                className="search-flex"
                style={{ height: 30, borderRadius: 40 }}
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm"
                onPressEnter={handleSearch}
              />
            ) : (
              // <Tooltip title='search'>
              <Input
                className="search-broken"
                style={{ height: 30, borderRadius: 40 }}
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm"
                onPressEnter={handleSearch}
              />
            )}
          </div>
          <div
            id="header-right"
            style={{
              width: isBroken ? '10%' : '38%',
              borderBottom: 'none',
              height: '64px',
              lineHeight: '60px',
              display: 'flex',
              justifyContent: !isBroken && 'flex-end',
              alignItems: 'center',
              marginRight: 10
            }}
          >
            {isAuth && !isBroken && (
              <Menu
                style={{
                  backgroundColor: 'initial'
                  // width: 50
                }}
                // overflowedIndicator={
                //   <UnorderedListOutlined style={{ fontSize: 23 }} />
                // }
                mode="horizontal"
              >
                <Menu.Item onClick={() => history.push('/seminars')}>
                  <Tooltip title="Hội thảo" placement="bottom">
                    <Button
                      className="btn-round"
                      shape="circle"
                      icon={<YoutubeOutlined />}
                    />
                  </Tooltip>
                </Menu.Item>
                <Menu.Item>
                  <Noti history={history} />
                </Menu.Item>
              </Menu>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {isAuth ? (
                isBroken ? (
                  <Dropdown
                    overlay={menu}
                    overlayStyle={{ position: 'fixed', top: 50 }}
                    trigger={['click']}
                  >
                    <Avatar
                      style={{
                        // top: '0.75em',
                        color: 'white',
                        backgroundColor: 'rgb(0, 152, 218)',
                        fontSize: '15px',
                        verticalAlign: 'sub'
                      }}
                      size={30}
                      src={me?.avatar}
                    />
                  </Dropdown>
                ) : (
                  <>
                    <Avatar
                      style={{
                        // top: '0.5em',
                        color: 'white',
                        backgroundColor: 'rgb(0, 152, 218)',
                        fontSize: '14px',
                        verticalAlign: 'sub'
                      }}
                      size={30}
                      src={me?.avatar}
                      onClick={() => history.push(`/${me?._id}/info`)}
                    >
                      {/* N */}
                    </Avatar>
                    <Dropdown
                      overlayStyle={{
                        position: 'fixed',
                        top: '50px !important'
                      }}
                      overlay={menu}
                      trigger={['click']}
                    >
                      <a
                        className="ant-dropdown-link"
                        style={{
                          paddingLeft: 5,
                          fontWeight: 'bold',
                          width: 'max-content'
                        }}
                        onClick={e => e.preventDefault()}
                      >
                        {me?.firstname} <CaretDownOutlined />
                      </a>
                    </Dropdown>
                  </>
                )
              ) : isBroken ? (
                <Button
                  onClick={() => history.push('/login')}
                  className="btn-round"
                  shape="circle"
                  icon={<LoginOutlined style={{ color: '#1890ff' }} />}
                />
              ) : (
                <Button type="primary" onClick={() => history.push('/login')}>
                  Đăng nhập
                </Button>
              )}
              {/* <Switch onChange={ () => myTheme?.toggleTheme()} /> */}
            </div>
            {/* </Col>
        </Row> */}
          </div>
        </div>
      </Header>
      {isBroken && (
        <Row
          style={{
            top: 64,
            zIndex: 100,
            background: '#fff',
            fontSize: 20,
            color: '#000'
          }}
          justify="space-between"
          className="row-menu"
          gutter={16}
        >
          <Col
            style={{
              textAlign: 'center',
              borderBottom:
                location === 'homepage' ? '1px solid #1890ff' : 'none'
            }}
            span={4}
            onClick={() => history.push('/homepage')}
          >
            {location === 'homepage' ? (
              <HomeOutlined style={{ color: '#1890ff' }} />
            ) : (
              <HomeOutlined />
            )}
          </Col>
          <Col
            style={{
              textAlign: 'center',
              borderBottom: location === 'notify' ? '1px solid #1890ff' : 'none'
            }}
            span={4}
            onClick={() => history.push('/notify')}
          >
            {location === 'notify' ? (
              <Badge
                dot={
                  notifications?.length === 0 ||
                  notifications?.filter(item => item.seen === false)?.length > 0
                }
              >
                <BellOutlined style={{ color: '#1890ff', fontSize: 20 }} />
              </Badge>
            ) : (
              <Badge
                dot={
                  notifications?.length === 0 ||
                  notifications?.filter(item => item.seen === false)?.length > 0
                }
              >
                <BellOutlined style={{ fontSize: 20 }} />
              </Badge>
            )}
          </Col>
          <Col
            style={{
              textAlign: 'center',
              borderBottom:
                location === 'communities' ? '1px solid #1890ff' : 'none'
            }}
            span={4}
            onClick={() => history.push('/communities')}
          >
            <TeamOutlined
              style={{
                color: location === 'communities' ? '#1890ff' : 'black'
              }}
            />
          </Col>
          <Col
            style={{
              textAlign: 'center',
              borderBottom:
                location === 'seminars' ? '1px solid #1890ff' : 'none'
            }}
            span={4}
            onClick={() => history.push('/seminars')}
          >
            {location === 'seminars' ? (
              <YoutubeOutlined style={{ color: '#1890ff' }} />
            ) : (
              <YoutubeOutlined />
            )}
          </Col>
          <Col
            style={{
              textAlign: 'center',
              borderBottom:
                location === 'messenger' ? '1px solid #1890ff' : 'none'
            }}
            span={4}
            onClick={() => history.push(`/messenger`)}
          >
            {location === 'messenger' ? (
              <MessageOutlined style={{ color: '#1890ff' }} />
            ) : (
              <MessageOutlined />
            )}
          </Col>
        </Row>
      )}
      <Layout
        className="home"
        style={{
          paddingTop: 100,
          width: '100%',
          paddingLeft: isBroken ? 0 : '1.5em',
          margin: '0 auto',
          backgroundColor: 'aliceblue'
        }}
      >
        <Sider
          breakpoint="lg"
          collapsedWidth={0}
          width={isBroken ? 0 : '25%'}
          onBreakpoint={broken => setIsBroken(broken)}
          trigger={null}
        >
          {/* { !isBroken && <div style={{ position: 'fixed' }}> */}
          {isBroken ? null : (
            <div className="highlight-group">
              <Typography.Title level={4}>CỘNG ĐỒNG NỔI BẬT</Typography.Title>
              <HighLightGroup
                history={history}
                loading={loading}
                dataCount={dataCount}
              ></HighLightGroup>
            </div>
          )}
          {/* </div>} */}
        </Sider>
        <Content
          id="content-main"
          style={{
            padding: isBroken ? 0 : '0 24px',
            paddingRight: !isBroken && 76,
            marginTop: 0,
            marginRight: !isBroken && '17%'
          }}
        >
          <MainContext.Provider
            value={{
              isBroken,
              chooseConversation: (idChat, userId) =>
                messBoxesRef.current.chooseConversation(idChat, userId)
            }}
          >
            {children}
          </MainContext.Provider>
        </Content>
        {!isBroken && isAuth && (
          <Sider
            width="17%"
            style={{
              position: 'fixed',
              right: 0,
              border: '#d5edf9 solid 2px !important',
              backgroundColor: '#e6f4ff',
              height: '100vh'
            }}
          >
            <div className="sidebarMess-mainLayout">
              <ConversationList
                chooseConversation={(idChat, userId) =>
                  messBoxesRef.current.chooseConversation(idChat, userId)
                }
              />
            </div>
          </Sider>
        )}
        {!isBroken && (
          <div className="messenger-main">
            <div className="contentMess-mainLayout">
              {/* {messbox.map((mess, idx) => {
                return (
                  <div
                    key={idx}
                    className={`contentMess-box ${mess.idChat}`}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <MessageList
                      history={history}
                      idx={idx}
                      // onCancelMessbox={() => onCancelMessbox(mess.idChat)}
                      chatBox={mess}
                    />
                  </div>
                )
              })} */}
              <Messboxes ref={messBoxesRef} />
            </div>
          </div>
        )}
      </Layout>
      <Modal
        visible={showLogin}
        title="Đăng nhập"
        footer={null}
        centered
        onCancel={closeLoginModal}
      >
        <Login></Login>
      </Modal>
      <Drawer
        width="90%"
        closable={false}
        visible={showCommunities}
        onClose={() => setShowCommunities(false)}
        title="Cộng đồng nổi bật"
        placement="left"
        footer={null}
      >
        <HighLightGroup
          isBroken={window.innerWidth < 600 }
          history={history}
          setShowCommunities={setShowCommunities}
        />
      </Drawer>
    </Layout>
  )
}
export default index
