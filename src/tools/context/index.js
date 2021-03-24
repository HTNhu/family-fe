/* eslint-disable no-undef */
import React, { useState, useMemo } from 'react'
import { SdkUtils } from '@utils'
import { withRouter } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { notification } from 'antd'
import * as firebase from 'firebase/app'
export const IContext = React.createContext()

const GET_ME = gql`
  query me {
    me {
      _id
      firstname
      lastname
      avatar
      coverPhoto
      email
      gender
      phoneNumber
      birthday
      role
      expert {
        areasOfExpertise
        jobTitle
        yearsExperience
        isVerify
      }
    }
  }
`
const ContextWrapper = ({ children, history }) => {
  const [isAuth, setIsAuth] = useState(
    !!window.localStorage.getItem('access-token')
  )
  const [showLogin, setShowLogin] = useState(false)
  const { loading, data, refetch } = useQuery(GET_ME, {
    skip: !isAuth
  })
  const authenticate = token => {
    window.localStorage.setItem('access-token', token)
    setIsAuth(true)
    showLogin ? setShowLogin(false) : history.push('/')
    refetch().then(() => {
      notification.success({
        message: 'Đăng nhập thành công',
        placement: 'bottomRight'
      })
    })
  }
  const logout = () => {
    firebase.database().ref(`messboxes/${data?.me?._id}`).remove()
    window.localStorage.clear()
    history.push('/homepage')
    SdkUtils.logoutFB()
    SdkUtils.loginGoogle()
    setIsAuth(false)
  }
  const openLoginModal = () => {
    setShowLogin(true)
  }
  const closeLoginModal = () => {
    setShowLogin(false)
  }

  const isSuper = useMemo(() => {
    if (data?.me) {
      return data?.me?.role === 'SUPERADMIN'
    }
  }, [data])
  const isAdmin = useMemo(() => {
    if (data?.me) {
      return data?.me?.role === 'ADMIN'
    }
  }, [data])
  if (loading) {
    return null
  }
  return (
    <IContext.Provider
      value={{
        isAuth,
        isAdmin: isAdmin,
        isSuper: isSuper,
        authenticate,
        logout,
        me: data?.me,
        history,
        refetchMe: refetch,
        showLogin: showLogin,
        openLoginModal: openLoginModal,
        closeLoginModal: closeLoginModal
      }}
    >
      {children}
    </IContext.Provider>
  )
}

export default withRouter(ContextWrapper)
