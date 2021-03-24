import React from 'react'
import AdminRoutes from './admin'
import FamilyRoutes from './family'
const Routers = () => {
  return process.env.ADMIN_SERVER === 'true' ? <AdminRoutes /> : <FamilyRoutes />
}

export default Routers
