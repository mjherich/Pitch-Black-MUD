import React, { useState } from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

import './App.css'
import bg from './8-bit-cave-background-2.jpg'
import lavabg from './animated-lava-bg.gif'
import Menu from './components/navigation'
import UserLogin from './components/Login'
import SignUp from './components/SignUp'
import Main from './components/Main'
import Team from './components/Team'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1d181e",
    },
    secondary: {
      main: "#124B52"
    },
    error: {
      main: "#82260d"
    },
    warning: {
      main: '#82260d'
    },
    info: {
      main: "#130d0f"
    },
    success: {
      main: "#0D8226"
    }
  },
})

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

let readLava = localStorage.getItem('lavaMode')
if (readLava && readLava === 'false') {
  readLava = false
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') ? true : false)
  const [lavaMode, setLavaMode] = useState(readLava || false)
  
  // SnackBar popup
  const [open, setOpen] = useState(false)
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false)
  }

  const [playerLocation, setPlayerLocation] = useState({
    x: 12,
    y: 12
  })

  const [map, setMap] = useState({
    cols: 25,
    rows: 25,
    tileWidth: 30,
    tileHeight: 30,
    tiles: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    getTile: function (col, row) {
      return this.tiles[row * map.cols + col]
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <div className={`App${lavaMode ? ' lava-on' : ''}`} style={{ backgroundImage: `url(${lavaMode ? lavabg : bg})`, backgroundPosition: 'center top', backgroundSize: 'cover' }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert onClose={handleClose} severity="success">
              Thanks for signing up, have fun!
          </Alert>
        </Snackbar>
        <Router>
          <Menu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} lavaMode={lavaMode} setLavaMode={setLavaMode} />
          <Route path="/login" render={(props) => <UserLogin {...props} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" render={(props) => <SignUp {...props} setIsLoggedIn={setIsLoggedIn} setOpen={setOpen} />} />
          <Route path="/team" component={Team} />
          <Route exact path="/" render={(props) => <Main {...props} map={map} setMap={setMap} playerLocation={playerLocation} setPlayerLocation={setPlayerLocation} isLoggedIn={isLoggedIn} lavaMode={lavaMode} />} />
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
