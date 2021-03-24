import React, { Suspense, lazy } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { AdminLayout } from '@layouts'

const AdminAuthRoutes = ({ context: { isAuth, me, logout, isAdmin, isSuper } }) => {
  const routes = [
    {
      exact: true,
      path: '/dashboard',
      component: 'dashboard',
      title: 'Dashboard Admin'
    },
    {
      exact: true,
      path: '/posts',
      component: 'posts',
      title: 'Manage Posts'
    },
    {
      exact: true,
      path: '/members',
      component: 'members',
      title: 'Manage Members'
    },
    {
      exact: true,
      path: '/awaitVerifyExpert',
      component: 'expertAwaitVerify',
      title: 'Chuyên gia'
    },
    {
      exact: true,
      path: '/communities',
      component: 'communities',
      title: 'Manage Communities'
    }
  ]
  const superRoutes = [
    {
      exact: true,
      path: '/manage-admin',
      component: 'manageAdmin',
      title: 'Manage Admin'
    }
  ]

  return (
    <AdminLayout>
      <Suspense fallback={null}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Redirect to={isAuth ? '/dashboard' : '/login'} />}
          />
          {routes.map((route, idx) => (
            <Route
              key={idx}
              exact={route.exact}
              path={route.path}
              render={() => {
                if (!isAuth) {
                  return <Redirect to="/login" />
                }
                if (!isAdmin && !isSuper) {
                  logout()
                  return <Redirect to="/403" />
                }
                const Component = lazy(() =>
                  import(`@pages/admin/${route.component}`)
                )
                document.title = route.title
                return <Component />
              }}
            />
          ))}
          {superRoutes.map((route, idx) => (
            <Route
              key={idx}
              exact={route.exact}
              path={route.path}
              render={() => {
                if (!isAuth) {
                  return <Redirect to="/login" />
                }
                if (!isSuper) {
                  logout()
                  return <Redirect to="/403" />
                }
                const Component = lazy(() =>
                  import(`@pages/admin/${route.component}`)
                )
                document.title = route.title
                return <Component />
              }}
            />
          ))}
          <Route render={() => <Redirect to="/404" />} />
        </Switch>
      </Suspense>
    </AdminLayout>
  )
}

export default AdminAuthRoutes
