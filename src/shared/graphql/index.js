import gql from 'graphql-tag'

export const GET_USER = gql`
  query getUser($userId: ID) {
    getUser(userId: $userId) {
      _id
      firstname
      lastname
      avatar
      coverPhoto
      email
      gender
      phoneNumber
      birthday
      expert {
        jobTitle
        areasOfExpertise
        yearsExperience
        isVerify
      }
    }
  }
`
export const UPDATE_USER = gql`
  mutation updateUser($userId: ID, $editUser: EditUser) {
    updateUser(userId: $userId, editUser: $editUser)
  }
`
export const UPDATE_USER_INFO = gql`
  mutation updateUserInfo($userId: ID, $userInfo: UserInfo) {
    updateUserInfo(userId: $userId, userInfo: $userInfo)
  }
`
export const VERIFY_OR_REJECT_EXPERT = gql`
  mutation verifyOrRejectExpert($userId: ID, $isVerify: Boolean) {
    verifyOrRejectExpert(userId: $userId, isVerify: $isVerify)
  }
`
export const CREATE_CHAT = gql`
  mutation createChat($members: [String]) {
    createChat(members: $members) {
      _id
      members
      isBlock
    }
  }
`
export const GET_CHAT_BY_MEMBERS = gql`
  query getChatByMembers($members: [String]) {
    getChatByMembers(members: $members) {
      _id
      members
      isBlock
    }
  }
`
export const GET_CHAT_BY_USER = gql`
  query getChatByUser($userId: String) {
    getChatByUser(userId: $userId) {
      _id
      members
      isBlock
    }
  }
`
export const CHECK_FOLLOW = gql`
  query checkFollow($id: FollowerInput) {
    checkFollow(id: $id)
  }
`
export const CREATE_FOLLOWER = gql`
  mutation createFollower($id: FollowerInput) {
    createFollower(id: $id)
  }
`
export const DELETE_FOLLOWER = gql`
  mutation deleteFollower($id: FollowerInput) {
    deleteFollower(id: $id)
  }
`
export const GET_POSTS = gql`
  query posts($quantity: Int) {
    posts(quantity: $quantity) {
      _id
      title
      thumbnail
      isActive
      content
      keywords
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
        expert{
          isVerify
        }
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
export const GET_POSTS_BY_USER = gql`
  query postsByUser($userId: String) {
    postsByUser(userId: $userId) {
      _id
      title
      content
      thumbnail
      keywords
      createdBy {
        _id
        firstname
        lastname
        avatar
      }
      createdAt
      community{
        _id
        name
        avatar
      }
    }
  }
`
export const CHECK_IS_SAVED = gql`
  query checkIsSaved($id: SavedPostInput) {
    checkIsSaved(id: $id)
  }
`
export const CREATE_AND_DELETE_SAVEDPOST = gql`
  mutation createAndDeleteSavedPost($id: SavedPostInput) {
    createAndDeleteSavedPost(id: $id)
  }
`
export const GET_SAVEDPOST_BY_USER = gql`
  query getSavedPostByUser($userId: String) {
    getSavedPostByUser(userId: $userId) {
      _id {
        userId
        postId
      }
      post {
        _id
        title
        content
        thumbnail
        keywords
        community {
          _id
          name
          avatar
        }
        isActive
        createdAt
        createdBy {
          _id
          firstname
          avatar
        }
      }
    }
  }
`
export const CHECK_IS_MEMBER = gql`
  query checkIsMember($id: CommunityUserInput) {
    checkIsMember(id: $id)
  }
`
export const CREATE_AND_DELETE_MEMBER = gql`
  mutation createAndDeleteMember($id: CommunityUserInput) {
    createAndDeleteMember(id: $id)
  }
`

export const GET_COMMUNITIES_BY_USER = gql`
  query getCommunitiesByUser($userId: String) {
    getCommunitiesByUser(userId: $userId) {
      _id {
        userId
      }
      community {
        _id
        name
        avatar
        coverPhoto
      }
    }
  }
`
export const GET_POST_BY_COMMUNITY = gql`
  query postsByCommunity($communityId: String) {
    postsByCommunity(communityId: $communityId) {
      _id
      title
      content
      thumbnail
      keywords
      createdBy {
        _id
        firstname
        lastname
        avatar
      }
      createdAt
      community{
        _id
        name
      }
    }
  }
`
export const GET_MEMBERS_BY_COMMUNITY = gql`
  query getMembersByCommunity($communityId: String) {
    getMembersByCommunity(communityId: $communityId){
      community{
        _id
        name
      }
      user{
        _id
        firstname
      }
    }
  }
`
