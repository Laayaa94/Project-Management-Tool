import React from 'react'
import NavBar from './NavBar/NavBar'
import SideNavBar from './SideNavBar/SideNavBar'

const Layout = ({children}) => {
  return (
    
    <div className="layout">
      <NavBar />
      <div className="layout-body">
        <SideNavBar/>
        <div className="content">
          {children}
        </div>
      </div>
    </div>

  )
}

export default Layout
