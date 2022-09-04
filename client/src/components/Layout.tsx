import React from 'react'
import classes from './Layout.module.css'
import logo from '../logo.png'

type Props = {children: React.ReactNode}

const Layout = ({children}: Props) => {
  return (
    <>
    <div className={classes.header}>
    <img src={logo} alt="logo"></img>  
    <h1> game pending...</h1>
    </div>
    {children}
    </>
  )
}

export default Layout