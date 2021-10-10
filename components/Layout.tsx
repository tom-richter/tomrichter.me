import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

export const MainConatiner = styled('main')(({ theme }) => ({
  padding: theme.spacing(1),
  margin: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  [theme.breakpoints.up('md')]: {
    width: '75%',
  },
  [theme.breakpoints.up('lg')]: {
    width: '60%',
  },
}))

const Navbar = () => {
  return (
    <AppBar position="static" id="main-menu">
      <Toolbar>
        <Box mr="auto" style={{ flex: 1 }}>
          <Link href="/">
            <Button color="inherit">Tom Richter</Button>
          </Link>
        </Box>
        <Link href="/geocaching">
          <Button color="inherit">Geocaching</Button>
        </Link>
      </Toolbar>
    </AppBar>
  )
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <meta name="description" content="Welcome on my personal website" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Tom Richter</title>
      </Head>
      <Navbar />
      <MainConatiner>{children}</MainConatiner>
    </div>
  )
}
export default Layout
