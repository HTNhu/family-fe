import React, { Suspense, lazy } from 'react'
import { MainLayout } from '@layouts'
import { Switch, Route, Redirect } from 'react-router-dom'

const FamilyAppRoutes = ({ isAuth }) => {
  const authRoutes = [
    {
      exact: true,
      path: '/:userId/messenger/:idChat',
      component: 'messageDetail',
      title: 'Chat'
    },
    {
      exact: true,
      path: '/messenger',
      component: 'myMessenger',
      title: 'Danh sách chat'
    },
    {
      exact: true,
      path: '/create-post',
      component: 'createPost',
      title: 'Tạo bài viết'
    },
    {
      exact: true,
      path: '/page-group/:communityId',
      component: 'pageGroup',
      title: 'Cộng đồng'
    },
    {
      exact: true,
      path: '/profile',
      component: 'profile',
      title: 'Trang cá nhân'
    },
    {
      exact: true,
      path: '/search-results',
      component: 'searchResults',
      title: 'Kết quả tìm kiếm'
    },
    {
      // exact: true,
      path: '/notify',
      component: 'notify',
      title: 'Thông báo'
    },
    {
      // exact: true,
      path: '/seminars',
      component: 'seminars',
      title: 'Hội thảo'
    }
  ]

  const commonRoutes = [
    {
      exact: true,
      path: '/homepage',
      component: 'homepage',
      title: 'Family'
    },
    {
      exact: true,
      path: '/communities',
      component: 'allCommunities',
      title: 'Cộng đồng'
    },
    {
      exact: true,
      path: '/popular',
      component: 'popularposts',
      title: 'Thịnh hành'
    },
    {
      exact: true,
      path: '/page-group/:communityId',
      component: 'pageGroup',
      title: 'Cộng đồng'
    },
    {
      exact: false,
      path: '/post-detail/:postId',
      component: 'postDetail',
      title: 'Chi tiết bài viết'
    },
    {
      exact: true,
      path: '/:userId/:type',
      component: 'profile',
      title: 'Trang cá nhân'
    }
  ]

  return (
    <MainLayout>
      <Suspense fallback={null}>
        <Switch>
          {isAuth &&
            authRoutes.map((route, idx) => (
              <Route
                key={idx}
                exact={route.exact}
                path={route.path}
                render={() => {
                  if (!isAuth) {
                    return <Redirect to="/login" />
                  }
                  const Component = lazy(() =>
                    import(`@pages/${route.component}`)
                  )
                  document.title = route.title
                  return <Component />
                }}
              />
            ))}
          {commonRoutes.map((route, idx) => (
            <Route
              key={idx}
              exact={route.exact}
              path={route.path}
              render={() => {
                const Component = lazy(() =>
                  import(`@pages/${route.component}`)
                )
                document.title = route.title
                return <Component />
              }}
            />
          ))}
          <Route path="/" render={() => <Redirect to="/homepage" />} />
          <Route render={() => <Redirect to="/404" />} />
        </Switch>
      </Suspense>
    </MainLayout>
  )
}

export default FamilyAppRoutes
