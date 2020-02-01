import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import GroupIcon from '@material-ui/icons/Group';
import GitHubIcon from '@material-ui/icons/GitHub';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  list: {
    width: 250,
    height: "100%",
    backgroundColor: "#2a242b",
    paddingTop: "30px",
  },
});

export default function Pusher({isOpen, handleClose, lavaMode, setLavaMode}) {
  const classes = useStyles();

  const sideList = () => (
    <div
      className={classes.list}
      role="presentation"
      onKeyDown={handleClose}
    >
      <Link to="/" onClick={handleClose} style={{ display: "block", textAlign: "center", textDecoration: "none", color: "#000", marginBottom: "10px" }} >
        <img src={`${process.env.PUBLIC_URL}/cave-192.png`} width="75" height="75" alt="Pitch Black Logo" />
        <Typography variant="h4" align="center">Pitch Black</Typography>
        <p>v1.0</p>
      </Link>
      <List>
        <ListItem button component={Link} to="/" onClick={handleClose}>
          <ListItemIcon><HomeIcon color="secondary"/></ListItemIcon>
          <ListItemText primary="Home" style={{color: "white"}}/>
        </ListItem>
        <ListItem button component={Link} to="/team" onClick={handleClose}>
          <ListItemIcon><GroupIcon color="secondary"/></ListItemIcon>
          <ListItemText primary="Team" style={{color: "white"}}/>
        </ListItem>
        <ListItem button onClick={() => {
          window.open("https://github.com/team-pitch-black")
          handleClose()
        }}>
          <ListItemIcon><GitHubIcon color="secondary"/></ListItemIcon>
          <ListItemText primary="Source Code" style={{color: "white"}}/>
        </ListItem>
        <ListItem>
        <FormControlLabel
          control={
            <Switch
              checked={lavaMode}
              value={lavaMode}
              onClick={() => {
                localStorage.setItem('lavaMode', !lavaMode)
                setLavaMode(!lavaMode)
              }}
              color="secondary"
            />
          }
          label="Lava Mode"
          style={{color: "white"}}
        />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className="drawer-container">
      <Drawer open={isOpen} onClose={handleClose} ModalProps={{ onBackdropClick: handleClose }}>
        {sideList('left')}
      </Drawer>
    </div>
  );
}