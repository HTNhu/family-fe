/* eslint-disable no-undef */
import React, { useContext } from 'react'
// import { Row, Col, Form, Input, Button, Divider, notification } from 'antd'
// import gql from 'graphql-tag'
// import { useMutation } from '@apollo/react-hooks'
// import {
//   GoogleOutlined,
//   FacebookFilled,
//   MailOutlined,
//   LockOutlined
// } from '@ant-design/icons'
// import { SdkUtils } from '@utils'
// import { MinimalLayout } from '@layouts'
// import { IContext } from '@tools'
import { Login } from '@components'
// import { Row, Col, Form, Input, Button, Divider } from 'antd'
// import gql from 'graphql-tag'
// import { useMutation } from '@apollo/react-hooks'
// import {
//   GoogleOutlined,
//   FacebookFilled,
//   MailOutlined,
//   LockOutlined
// } from '@ant-design/icons'
import { SdkUtils } from '@utils'
import { MinimalLayout } from '@layouts'
import { IContext } from '@tools'
import { notificationError } from '@shared'

// const SIGN_IN = gql`
//   mutation signIn($email: String, $password: String) {
//     signIn(email: $email, password: $password) {
//       accessToken
//     }
//   }
// `

// const SIGN_IN_FACEBOOK = gql`
//   mutation signInWithFacebook($facebookAuthData: FacebookAuthData) {
//     signInWithFacebook(facebookAuthData: $facebookAuthData) {
//       accessToken
//     }
//   }
// `

// const SIGN_IN_GOOGLE = gql`
//   mutation signInWithGoogle($token: String) {
//     signInWithGoogle(token: $token) {
//       accessToken
//     }
//   }
// `

const SignIn = () => {
  // const { authenticate, history } = useContext(IContext)
  // const [signIn] = useMutation(SIGN_IN)
  // const [signInWithFacebook] = useMutation(SIGN_IN_FACEBOOK)
  // const [signInWithGoogle] = useMutation(SIGN_IN_GOOGLE)
  // const login = async values => {
  //   signIn({
  //     variables: {
  //       ...values
  //     }
  //   }).then(
  //     ({
  //       data: {
  //         signIn: { accessToken }
  //       }
  //     }) => {
  //       authenticate(accessToken)
  //     }
  //   ).catch(({ graphQLErrors }) => {
  //     notification.error({
  //       message: graphQLErrors[0].message,
  //       placement: 'bottomRight'
  //     })
  //   })
  // }
  // const loginFB = async () => {
  //   const { accessToken, userID } = await SdkUtils.loginFB()
  //   signInWithFacebook({
  //     variables: {
  //       facebookAuthData: { accessToken, userID }
  //     }
  //   }).then(
  //     ({
  //       data: {
  //         signInWithFacebook: { accessToken }
  //       }
  //     }) => {
  //       authenticate(accessToken)
  //     }
  //   )
  // }
  // const loginGG = async () => {
  //   const idToken = await SdkUtils.loginGoogle()
  //   signInWithGoogle({
  //     variables: {
  //       token: idToken
  //     }
  //   }).then(
  //     ({
  //       data: {
  //         signInWithGoogle: { accessToken }
  //       }
  //     }) => {
  //       authenticate(accessToken)
  //     }
  //   )
  // }
  return (
    <MinimalLayout>
  <Login></Login>
    </MinimalLayout>
  )
}

export default SignIn
