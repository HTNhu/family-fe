/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import { withRouter } from 'react-router-dom'
import ConversationList from './ConversationList'
import { MainContext } from '../../layouts/MainLayout'
// import Messenger from './Messenger'

const MyMessenger = props => {
  const { isBroken } = useContext(MainContext)
  return (
    <div>
      <ConversationList isBroken={isBroken} history={props.history} name='conversation-list-phone'></ConversationList>
      {/* <Messenger></Messenger> */}
    </div>
  )
}

export default withRouter(MyMessenger)
