/* eslint-disable object-curly-spacing */
/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect } from 'react'
import ConversationSearch from '../ConversationSearch'
import * as firebase from 'firebase/app'
import './index.scss'
import { List } from 'antd'

import ConversationListItem from '../ConversationListItem'
import { IContext } from '@tools'

export default function ConversationList(props) {
  const { me } = useContext(IContext)
  const [dataChat, setDataChat] = useState([])
  const [searchdataChat, setSearchdataChat] = useState(null)
  const [dataChatConver, setdataChatConver] = useState([])
  const { chooseConversation, isBroken } = props
  useEffect(() => {
    getMess()
  }, [])
  useEffect(() => {
    getMess()
  }, [me])
  const getMess = () => {
    firebase
      .database()
      .ref(`messenger/`)
      .on('value', snapshot => {
        const temp = snapshot.val()
          ? Object.keys(snapshot.val()).map(key => ({
              ...snapshot.val()[key],
              id: key
            }))
          : []
        const arr = temp.filter(
          item => item?.members?.findIndex(mem => mem === me?._id) !== -1
        )
        arr.sort((a, b) => b.lastActivity - a.lastActivity)
        setDataChat(arr)
        setdataChatConver(arr)
      })
  }
  const onSearch = data => {
    const arrResult = [...dataChatConver]
    const res = arrResult.filter(item => {
      return item.name.toLowerCase().includes(data.toLowerCase()) === true
    })
    data.trim() === '' ? setSearchdataChat(null) : setSearchdataChat(res)
  }
  const addSearch = data => {
    const idx = dataChatConver.findIndex(item => item?.id === data?.id)
    dataChatConver[idx] = { ...dataChatConver[idx], name: data.name }
  }
  return (
    <div className={props.name || 'conversation-list'}>
      {/* <Toolbar
        title="Messenger"
        leftItems={[<ToolbarButton key="cog" icon="ion-ios-cog" />]}
        rightItems={[
          <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
        ]}
      /> */}
      <ConversationSearch search={onSearch} />
      {/* <ConversationSearch /> */}
      <List
        itemLayout="horizontal"
        // loadMore={loadMore}
        dataSource={searchdataChat || dataChat}
        renderItem={(dataChat, idx) => (
          <ConversationListItem
            isBroken={isBroken}
            chooseConversation={(idChat, userId) =>
              chooseConversation(idChat, userId)
            }
            addSearch={addSearch}
            key={idx}
            chat={dataChat}
            history={props.history}
          ></ConversationListItem>
          // <ConversationListItem key={idx} chat={dataChat} history={props.history}></ConversationListItem>
        )}
      />
    </div>
  )
}
