import React, { useState, useLayoutEffect } from 'react'
import { Row, Col } from 'antd'
import { Logo } from '@components'
import bg from '@assets/images/bg-family.jpg'
const MinimalLayout = ({ children }) => {
  const [isBreak, setIsBreak] = useState(window.screen.width < 768)
  useLayoutEffect(() => {
    window.addEventListener('resize', e =>
      setIsBreak(e.target.screen.width < 768)
    )
  }, [])
  return (
    <Row
      style={{
        height: '100vh',
        ...(isBreak
          ? { background: '#fff' }
          : {
              backgroundImage:
                `url(${bg})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            })
      }}
    >
      <Col xs={24} md={{ span: 12, offset: 12 }} flex="auto">
        <Row style={{ height: '100vh' }} justify="center" align="middle">
          <Col xs={22} sm={20} md={18}>
            <div style={{ marginBottom: 30, textAlign: 'center' }}>
              <Logo size="large" />
            </div>
            {children}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default MinimalLayout
