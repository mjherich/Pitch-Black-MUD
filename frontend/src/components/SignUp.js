import React from 'react'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
class SignUp extends React.Component {
    state = {
        credentials: {
            username: '',
            password: ''
        },
        open: false
    }

    // Close Snackbar
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            ...this.state,
            open: false
        })
    };

    // onChange handler
    handleChange = e => {
        this.setState({
            credentials: {
                ...this.state.credentials,
                [e.target.name]: e.target.value
            }
        })
    }

    // onSubmit handler
    login = e => {
        e.preventDefault()
        axios
            .post("https://pitch-black.herokuapp.com/api/registration/", this.state.credentials)
            .then(res => {
                localStorage.setItem("token", res.data.key)
                this.props.setIsLoggedIn(true)
                this.props.setOpen(true)
                this.props.history.push('/')
            })
            .catch(err => {
                // Display Snackbar
                this.setState({
                    ...this.state,
                    open: true
                })
                console.log(err.response)
            })
    }

    render() {
        return (
            <div className="signup-form">
                <div style={{ backgroundColor: "#b7b7b7", maxWidth: "350px", margin: "auto", padding: "30px", borderRadius: "4px" }}>
                    <h2>Sign Up</h2>
                    <form autoComplete="off">
                        <FormControl>
                            <TextField
                                name="username"
                                label="Username"
                                variant="outlined"
                                value={this.state.credentials.username}
                                onChange={this.handleChange}
                                style={{ margin: "5px 0 12px 0" }}
                            />
                            <TextField
                                name="password1"
                                label="Password"
                                type="password"
                                variant="outlined"
                                value={this.state.credentials.password1}
                                onChange={this.handleChange}
                                style={{ margin: "5px 0 12px 0" }}
                            />
                            <TextField
                                name="password2"
                                label="Password"
                                type="password"
                                variant="outlined"
                                value={this.state.credentials.password2}
                                onChange={this.handleChange}
                                style={{ margin: "5px 0 12px 0" }}
                            />
                            <Button variant="contained" onClick={this.login} style={{ marginBottom: "20px" }} color="secondary" type="submit">Sign Up</Button>
                            <Snackbar open={this.state.open} autoHideDuration={6000} onClose={this.handleClose}>
                                <Alert onClose={this.handleClose} severity="error">
                                    There was an error signing up, please try again
                                </Alert>
                            </Snackbar>
                        </FormControl>
                    </form>
                </div>
            </div>
        )
    }
}

export default SignUp