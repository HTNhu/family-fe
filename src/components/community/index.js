import React, { useContext, useState } from 'react'
import { Avatar, List, Skeleton, Space, Tooltip } from 'antd'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { IContext } from '@tools'
import JoinBtn from '../joinBtn'
import { GET_COMMUNITY_BY_ID } from '@pages/pageGroup'
import ModalMemberInfo from '@pages/pageGroup/modalMemberInfo'
import { GET_MEMBERS_BY_COMMUNITY } from '@shared'
import ReactionInfo from '../post/reactionInfo'
import { LoadingOutlined } from '@ant-design/icons'
function CommunityItem(props) {
  const { item } = props
  const { me } = useContext(IContext)
  const history = useHistory()
  const [visible, setVisible] = useState(false)
  const { data, loading } = useQuery(GET_COMMUNITY_BY_ID, {
    variables: { id: item?.id },
    fetchPolicy: 'no-cache',
    skip: !item?.id
  })
  const { data: dataMems, loading: loadingMems } = useQuery(
    GET_MEMBERS_BY_COMMUNITY,
    {
      variables: { communityId: item?.id },
      fetchPolicy: 'no-cache',
      skip: !item?.id
    }
  )
  return loading ? (
    <Skeleton active></Skeleton>
  ) : (
    <List.Item
      onClick={() => {
        props?.setShowCommunities && props.setShowCommunities(false)
        // history.push(`/page-group/${item?._id}`)
      }}
      style={{ backgroundColor: '#fff', marginBottom: 10, padding: 10 }}
    >
      <List.Item.Meta
        style={{ display: 'flex' }}
        avatar={
          <Avatar size={64} shape="square" src={data?.communityById?.avatar} />
        }
        title={
          <a
            style={{ color: 'black', fontWeight: 'bold' }}
            onClick={() => history.push(`/page-group/${item?.id}`)}
          >
            {data?.communityById?.name}
          </a>
        }
        description={
          window.innerWidth <= 600 ? (
            <Space>
              <p onClick={() => setVisible(true)}>
                {item?.membersCount} thành viên{' '}
              </p>
              <p>- {item?.postsCount} bài viết</p>
            </Space>
          ) : (
            <Space>
              <Tooltip
                title={
                  loadingMems ? (
                    <LoadingOutlined />
                  ) : (
                    <div>
                      {dataMems?.getMembersByCommunity
                        ?.slice(0, 5)
                        .map(data => {
                          return (
                            <ReactionInfo
                              type="tooltip"
                              key={data?.user?._id}
                              userId={data?.user?._id}
                            />
                          )
                        })}
                      {dataMems?.getMembersByCommunity?.length > 5 && (
                        <p>{`...và ${
                          dataMems?.getMembersByCommunity?.length - 5
                        } nguời khác`}</p>
                      )}
                    </div>
                  )
                }
              >
                <p onClick={() => setVisible(true)}>
                  {item?.membersCount} thành viên{' '}
                </p>
              </Tooltip>
              <p>- {item?.postsCount} bài viết</p>
            </Space>
          )
        }
      />
      {props.isActionJoin && (
        <JoinBtn
          id={{ userId: me?._id, communityId: item?.id }}
          history={history}
          // refetchDataMemberCount={refetchDataMemberCount}
        />
      )}
      <ModalMemberInfo
        visible={visible}
        setVisible={setVisible}
        members={dataMems?.getMembersByCommunity}
      />
    </List.Item>
  )
  // )}
  // />
}
export default CommunityItem
