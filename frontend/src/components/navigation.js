import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import Pusher from './Pusher'

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        marginBottom: "30px"
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        textAlign: "left"
    },
}));

export default function MenuAppBar({ isLoggedIn, setIsLoggedIn, lavaMode, setLavaMode }) {
    const [isOpen, setIsOpen] = useState(false)
    const classes = useStyles();

    const handleClose = () => {
        setIsOpen(false)
    }

    const handleLogout = e => {
        localStorage.removeItem('token')
        setIsLoggedIn(false)
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={e => setIsOpen(true)} >
                        <MenuIcon />
                    </IconButton>
                    <div className={classes.title}>
                        <Link to="/" style={{textDecoration: "none", color: "white"}} >
                            <img src={`${process.env.PUBLIC_URL}/cave-192.png`} width="35" height="35" alt="Pitch Black Logo" />
                        </Link>
                    </div>
                    {isLoggedIn ? (
                        <div>
                            <ButtonGroup color="secondary" variant="contained">
                                <Button color="secondary" onClick={handleLogout}>Log Out</Button>
                            </ButtonGroup>
                        </div>
                    ) : (
                        <ButtonGroup color="secondary" variant="contained">
                            <Button component={Link} to="/login">Log In</Button>
                            <Button component={Link} to="/signup">Sign Up</Button>
                        </ButtonGroup>
                        )}
                </Toolbar>
            </AppBar>
            <Pusher isOpen={isOpen} handleClose={handleClose} lavaMode={lavaMode} setLavaMode={setLavaMode} />
        </div>
    );
}