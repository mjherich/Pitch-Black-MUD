import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import IconButton from "@material-ui/core/IconButton";
import PersonIcon from '@material-ui/icons/Person'
import PanToolIcon from '@material-ui/icons/PanTool';
import DeleteIcon from "@material-ui/icons/Delete"
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined'
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined'
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined'

import Dungeon from './Dungeon/Dungeon'
import Loader from './Loader'
import { axiosWithAuth } from '../axiosWithAuth'


export default function Main({ map, setMap, playerLocation, setPlayerLocation, isLoggedIn, lavaMode }) {
    const [roomName, setRoomName] = useState('')
    const [playersInRoom, setPlayersInRoom] = useState([])
    const [itemsInRoom, setItemsInRoom] = useState([])
    const [personalItems, setPersonalItems] = useState([])
    const [isLoaded, setIsLoaded ] = useState(false)
    useEffect(() => {
        if (isLoggedIn) {
            axiosWithAuth()
                .get('https://pitch-black.herokuapp.com/api/adv/map/')
                .then(res => {
                    const rooms = res.data.rooms
                    let tileIdx
                    let newTiles = [...map.tiles]
                    for (const room of rooms) {
                        tileIdx = room.grid_y * map.cols + room.grid_x
                        newTiles[tileIdx] = parseInt(room.room_type)
                    }
                    setMap(prevState => {
                        return {
                            ...prevState,
                            tiles: newTiles
                        }
                    })
                    setIsLoaded(true)
                })
                .catch(err => console.log(err))
                updatePlayerLocation()
            }
    }, [])

    const updatePlayerLocation = () => {
        axiosWithAuth()
        .get("https://pitch-black.herokuapp.com/api/adv/init/")
        .then(res => {
            setPlayerLocation({x: res.data.grid_x, y: res.data.grid_y,})
            setPlayersInRoom(res.data.players)
            setPersonalItems(res.data.player_items)
            setItemsInRoom(res.data.room_items)
            setRoomName(res.data.description)
        })
        .catch(err => {console.log(err)})
    }

    const movementHandler = (direction) => {
        axiosWithAuth()
            .post("https://pitch-black.herokuapp.com/api/adv/move/", {'direction': direction})
            .then(res => {
                console.log(res)
                setPlayerLocation({x: res.data.grid_x, y: res.data.grid_y,})
                setPlayersInRoom(res.data.players)
                setItemsInRoom(res.data.room_items)
                setRoomName(res.data.description)
            })
            .catch(err => {console.log(err)})

    }

    const moveHandler = (direction) => {

        if (direction === 'up') {
            if (map.getTile(playerLocation.x, playerLocation.y - 1) === 0 || map.getTile(playerLocation.x, playerLocation.y - 1) === undefined) {

            } else {
                movementHandler('d')
            }
        } else if (direction === 'down') {
            if (map.getTile(playerLocation.x, playerLocation.y + 1) === 0 || map.getTile(playerLocation.x, playerLocation.y + 1) === undefined) {

            } else {
                movementHandler('u')
            }

        } else if (direction === 'left') {
            if (map.getTile(playerLocation.x - 1, playerLocation.y) === 0 || playerLocation.x - 1 < 0) {

            } else {
                movementHandler('l')
            }

        } else if (direction === 'right') {
            if (map.getTile(playerLocation.x + 1, playerLocation.y) === 0 || playerLocation.x + 1 > 24) {

            } else {
                movementHandler('r')
            }
        }
    }

    const grabItem = (itemName) => {
        axiosWithAuth()
            .post('https://pitch-black.herokuapp.com/api/adv/get-item/', {'item': itemName})
            .then(res => {
                console.log(res)
                setItemsInRoom(res.data.room_items)
                setPersonalItems(res.data.player_items)
            })
            .catch(err => {console.log(err)})

    }

    const dropItem = (itemName) => {
        axiosWithAuth()
        .post('https://pitch-black.herokuapp.com/api/adv/drop-item/', {'item': itemName})
        .then(res => {
            console.log(res)
            setItemsInRoom(res.data.room_items)
            setPersonalItems(res.data.player_items)
        })
        .catch(err => {console.log(err)})

    }

    // Event Listeners for arrow movement with keys
    document.onkeydown = (e) => {
        e = e || window.event;
        checkKey(e)
    };

    function checkKey(e) {
        e = e || window.event;

        if (e.key === 'ArrowUp') {
            // up arrow
            console.log('up')
            e.preventDefault()
            moveHandler('up')
        }
        else if (e.key === 'ArrowDown') {
            // down arrow
            console.log('down')
            e.preventDefault()
            moveHandler('down')
        }
        else if (e.key === 'ArrowLeft') {
            // left arrow
            console.log('left')
            e.preventDefault()
            moveHandler('left')
        }
        else if (e.key === 'ArrowRight') {
            // right arrow
            console.log('right')
            e.preventDefault()
            moveHandler('right')
        }
    }

    if (isLoggedIn) {
        return (
            <Container id="main">
                <Typography variant="h1" color="error">Pitch Black</Typography>
                <Typography variant="h4" color="error" style={{marginBottom: "50px"}}>Multi User Dungeon Game</Typography>
                <Grid container justify="center" spacing={3}>
                    <Grid item>
                        <div className="ui-item" style={{minWidth: "750px", minHeight: "750px"}}>
                            {isLoaded ? (
                                <Dungeon map={map} setIsLoaded={setIsLoaded} playerLocation={playerLocation} lavaMode={lavaMode} />
                            ) : (
                                <div style={{height: "750px", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                    <Typography variant="h5" style={{color: "white", marginBottom: "15px"}}>Loading...</Typography>
                                    <Loader />
                                </div>
                            )}
                        </div>
                    </Grid>
                    <Grid item style={{ minHeight: "100%" }}>
                        <Grid container direction="column" alignItems="center" spacing={3}>
                            <Grid item>
                                <div className="ui-item">
                                    <Grid item style={{ fontSize: "50px" }}>
                                        <ArrowUpwardOutlinedIcon onClick={() => moveHandler('up')} style={{ color: 'white' }} fontSize='inherit' />
                                    </Grid>
                                    <Grid item style={{ fontSize: "50px" }}>
                                        <ArrowBackOutlinedIcon fontSize="inherit" onClick={() => moveHandler('left')} style={{ color: 'white' }} />
                                        <ArrowDownwardOutlinedIcon fontSize="inherit" onClick={() => moveHandler('down')} style={{ color: 'white' }} />
                                        <ArrowForwardOutlinedIcon fontSize="inherit" onClick={() => moveHandler('right')} style={{ color: 'white' }} />
                                    </Grid>
                                </div>
                            </Grid>
                            <Grid item>
                                <div className="ui-item">
                                    <h2>{roomName}</h2>
                                    <h3>Players</h3>
                                    <List dense={true}>
                                    {playersInRoom.map((player)=> (
                                        <ListItem key={player}>
                                            <ListItemIcon>
                                                <PersonIcon color="secondary"/>
                                            </ListItemIcon>
                                            <ListItemText primary={player} style={{color: "white"}}/>
                                        </ListItem>
                                    ))}
                                    </List>
                                    <h3>Items</h3>
                                    {itemsInRoom.length > 0 ? 
                                        <List dense>
                                        {itemsInRoom.map((item)=> (
                                            <ListItem>
                                                <ListItemText primary={item} style={{color: "white"}} />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" aria-label="delete">
                                                        <PanToolIcon color="secondary" onClick={() => grabItem(item)} />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            )
                                        )}
                                        </List> : <p>Empty</p>
                                    }
                                </div>
                            </Grid>
                            <Grid item>
                                <div className="ui-item">
                                    <h3>Backpack</h3>
                                        {personalItems.length > 0 ? 
                                        <List dense>
                                        {personalItems.map((item)=> {
                                            return (
                                                <ListItem>
                                                    <ListItemText primary={item} style={{color: "white"}} />
                                                    <ListItemSecondaryAction>
                                                        <IconButton edge="end" aria-label="delete">
                                                            <DeleteIcon color="error" onClick={() => dropItem(item)} />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            )}
                                        )}
                                        </List> : <p>Empty</p>
                                        }
                                </div>
                            </Grid>
                            <Grid item>
                                <div className="ui-item">
                                    <h3>Chat</h3>
                                    {false ? (
                                        <>
                                            <div className='chat-box' style={{ display: 'flex', padding: 10, borderRadius: 5, height: 300, width: 300, backgroundColor: 'grey' }}>
                                                {
                                                    //loop through messages
                                                }
                                            </div>
                                            <input placeholder='type here' style={{ width: 314, borderRadius: 5 }} />
                                        </>
                                    ) : <p>Work In Progress...</p>}
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        )
    } else {
        return (
            <>
                <Typography variant="h1" color="error">Pitch Black</Typography>
                <Typography variant="h4" color="error">Multi User Dungeon Game</Typography>
            </>
        )
    }
}