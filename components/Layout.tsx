import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
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

const GeocachingMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const router = useRouter()

  return (
    <div>
      <Button color="inherit" onClick={handleClick}>
        Geocaching
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => router.push('/geocaching/gpx-builder')}>
          GPX-Builder
        </MenuItem>
        <MenuItem onClick={() => router.push('/geocaching/equation-solver')}>
          Equation-Solver
        </MenuItem>
      </Menu>
    </div>
  )
}

const Navbar = () => {
  return (
    <AppBar position="static" id="main-menu">
      <Toolbar>
        <Box mr="auto" style={{ flex: 1 }}>
          <Link href="/" passHref>
            <Button color="inherit">Home</Button>
          </Link>
        </Box>
        <GeocachingMenu />
        <Link href="/contact" passHref>
          <Button color="inherit">Contact</Button>
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
