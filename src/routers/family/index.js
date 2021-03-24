import React, { useContext, Suspense, lazy } from 'react'
import { IContext } from '@tools'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Result, Button } from 'antd'
import FamilyAppRoutes from './app'

const FamilyRoutes = () => {
  const { history, isAuth } = useContext(IContext)
  const routes = [
    {
      exact: true,
      path: '/verify/:verifyToken',
      component: 'verifyAccount',
      title: 'Xác minh tài khoản'
    },
    {
      exact: true,
      path: '/login',
      component: 'signIn',
      title: 'Đăng nhập'
    },
    {
      exact: true,
      path: '/register',
      component: 'signUp',
      title: 'Đăng ký thành viên'
    }
  ]

  const authRoutesNoLayout = [
    {
      path: '/seminar/:idSeminar',
      component: 'seminar',
      title: 'Hội thảo'
    },
    {
      path: '/joinseminar/:idSeminar',
      component: 'joinSeminar',
      title: 'Tham dự hội thảo'
    }
  ]

  return (
    <Suspense fallback={null}>
      <Switch>
        {routes.map((route, idx) => (
          <Route
            key={idx}
            exact={route.exact}
            path={route.path}
            render={() => {
              const Component = lazy(() => import(`@pages/${route.component}`))
              document.title = route.title
              return <Component />
            }}
          />
        ))}
        {authRoutesNoLayout.map((route, idx) => (
          <Route
            key={idx}
            exact={route.exact}
            path={route.path}
            render={() => {
              if (!isAuth) {
                return <Redirect to="/login" />
              }
              const Component = lazy(() => import(`@pages/${route.component}`))
              document.title = route.title
              return <Component />
            }}
          />
        ))}
        <Route
          path="/ket-thuc"
          render={() => {
            document.title = 'Phòng chờ'
            return (
              <Result
                title="Hội thảo đã kết thúc"
                subTitle="Người thuyết trình đã kết thúc buổi hội thảo hoặc có sự cố khiến buổi hội thảo tạm dừng. Xin cảm ơn!"
                extra={
                  <Button
                    onClick={() => history.push('/homepage')}
                    type="primary"
                  >
                    Trở về trang chủ
                  </Button>
                }
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
                extra={<Button type="primary">Back Home</Button>}
              />
            )
          }}
        />
        <Route
          path="/success"
          render={() => {
            document.title = 'Thành công'
            return (
              <Result
                status="success"
                title="Đăng ký thành viên thành công!"
                subTitle="Vui lòng kiểm tra mail để xác minh tài khoản."
                extra={[
                  <Button
                    onClick={() => history.push('/login')}
                    type="primary"
                    key="login"
                  >
                    Đăng nhập
                  </Button>,
                  <Button onClick={() => history.push('/homepage')} key="home">
                    Về trang chủ
                  </Button>
                ]}
              />
            )
          }}
        />
        <Route path="/" render={() => <FamilyAppRoutes isAuth={isAuth} />} />
      </Switch>
    </Suspense>
  )
}

export default FamilyRoutes
