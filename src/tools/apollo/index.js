import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { onError } from 'apollo-link-error'
const domain = window.location.host
const endPoint = process.env.GRAPHQL_END_POINT
const urn = process.env.GRAPHQL_URN || `${domain}/${endPoint}`

const httpLink = new HttpLink({
  uri: `${window.location.protocol}//${urn}`
})

const errorMiddleware = onError(({ graphQLErrors, networkError, response }) => {
  if (graphQLErrors) {
    if (response) {
      graphQLErrors.map(({ message, code }) => {
        if (code === 'UNAUTHENTICATED') {
          window.localStorage.clear()
          window.location.reload()
        }
      })
      response.errors = graphQLErrors
    }
  }
  if (networkError) {
    console.error(`[Network Error]: ${networkError}`)
  }
})

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'access-token': localStorage.getItem('access-token') || ''
  }
}))

const link = ApolloLink.from([errorMiddleware, httpLink])

const Client = new ApolloClient({
  // ssrMode: true,
  link: authLink.concat(link),
  cache: new InMemoryCache()
})
// s
export { Client }
