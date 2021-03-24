import { notification } from 'antd'

export const notificationError = ({ graphQLErrors }) => {
  notification.error({
    message: graphQLErrors[0].message,
    placement: 'bottomRight'
  })
}
