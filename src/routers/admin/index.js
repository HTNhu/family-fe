import React, { useContext, Suspense, lazy } from 'react'
import { IContext } from '@tools'
import AdminAuthRoutes from './auth'
import { Route, Redirect, Switch } from 'react-router-dom'
import { Result, Button } from 'antd'

const AdminRoutes = () => {
  const context = useContext(IContext)
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route
          exact
          path="/login"
          render={() => {
            if (context.isAuth) {
              return <Redirect to="/" />
            }
            const Component = lazy(() => import(`@pages/admin/login`))
            document.title = 'Đăng nhập Admin'
            return <Component />
          }}
        />
        <Route
          path="/403"
          render={() => {
            document.title = '403'
            return (
              <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
              />
            )
          }}
        />
        <Route
          path="/404"
          render={() => {
            document.title = '404'
            return (
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
              />
            )
          }}
        />
        <Route
          path="/"
          render={() => (
            <AdminAuthRoutes context={context} />
          )}
        />
      </Switch>
    </Suspense>
  )
}

export default AdminRoutes
