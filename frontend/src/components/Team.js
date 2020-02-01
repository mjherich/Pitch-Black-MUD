import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Hidden from '@material-ui/core/Hidden';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';

import alfredo from './alfredo.jpg'
import blaine from './blaine.jpg'

const teamMembers = [
    {
        "name": "Matt Herich",
        "role": "React Developer",
        "description": "null",
        "image": "https://avatars0.githubusercontent.com/u/8888824?s=460&v=4",
        "github": "https://github.com/mjherich",
        "linkedin": "https://www.linkedin.com/in/matt-herich/",
    },
    {
        "name": "Blaine Blonquist",
        "role": "React Developer",
        "description": "null",
        "image": blaine,
        "github": "https://github.com/bquizza5",
        "linkedin": "https://www.linkedin.com/in/blaine-blonquist-0b2b9bb2/",
    },
    {
        "name": "Bryan Szendel",
        "role": "Django Developer",
        "description": "null",
        "image": "https://avatars0.githubusercontent.com/u/22917212?s=460&v=4",
        "github": "https://github.com/bryanszendel",
        "linkedin": "https://www.linkedin.com/in/bryan-szendel/",
    },
    {
        "name": "Michael Hart",
        "role": "Django Developer",
        "description": "null",
        "image": "https://avatars2.githubusercontent.com/u/48599443?s=460&v=4",
        "github": "https://github.com/worksofhart",
        "linkedin": "null",
    },
    {
        "name": "Alfredo Quintana",
        "role": "Django Developer",
        "description": "null",
        "image": alfredo,
        "github": "https://github.com/alqu7095/",
        "linkedin": "https://www.linkedin.com/in/alfredo-quintana-98248a76/",
    }
]

const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
    },
    cardDetails: {
        flex: 1,
        textAlign: 'left',
        height: '220px',
    },
    cardMedia: {
        width: 160,
    },
    button: {
        margin: theme.spacing(1),
    },
}));

function TeamMember({person}) {
    const classes = useStyles();

    return (
        <Grid item xs={12} md={4}>
            <Card className={classes.card}>
            <div className={classes.cardDetails}>
                <CardContent>
                    <Typography component="h2" variant="h5">
                        {person.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {person.role}
                    </Typography>
                    <Button className={classes.button} variant="contained" size="small" startIcon={<GitHubIcon />} onClick={() => window.open(person.github)}>
                        GitHub
                    </Button>
                    <Button className={classes.button} variant="contained" size="small" startIcon={<LinkedInIcon />} onClick={() => window.open(person.linkedin)}>
                        LinkedIn
                    </Button>
                </CardContent>
            </div>
            <Hidden xsDown>
                <CardMedia className={classes.cardMedia} image={person.image} title={person.name} />
            </Hidden>
            </Card>
        </Grid>
    );
}

export default function Team() {
    return (
        <Container>
            <Typography variant="h1" color="error">Meet The Team</Typography>
            <Typography variant="h5" color="error">This project was built over the course of one week during Lambda School's CS section. Meet the people who made it happen!</Typography>
            <Grid container spacing={4} style={{marginTop: "15px"}}>
                {teamMembers.map(person => <TeamMember person={person} key={person.name} />)}
            </Grid>
        </Container>
    )
}