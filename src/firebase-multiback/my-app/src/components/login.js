import React, { Component } from 'react';
import request from 'superagent';
import createBrowserHistory  from 'history/createBrowserHistory';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const history = createBrowserHistory ({
  forceRefresh: true
});

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      email : '',
      password : '',
    };
  }

  handleChangeEmail = (event) => {
    this.setState({email : event.target.value});
  }

  handleChangePassword = (event) => {
    this.setState({password : event.target.value});
  }

  handleSubmit = (event) => {
    if(this.state.email === '') {
      alert("Email required");
      return;
    } else if(this.state.password === '') {
      alert("Password required");
      return;
    }

    const url = "http://localhost:8080/login?email=" + this.state.email + "&password=" + this.state.password;
    request.get(url)
      .end((err, res) => {
          if (err) {
            alert("Retry", err);
          } else if (res.body.type === "ERROR") {
            console.log(res.body.message);
            alert(res.body.data.message);
          } else if (res.body.type === "SUCCESS"){
            history.push('/backups/all', {token: res.body.data});
          }
        });
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField value={this.state.email} onChange={this.handleChangeEmail} hintText="Email" />
        <br />
        <TextField type="password" value={this.state.password} onChange={this.handleChangePassword} hintText="Password"/>
        <br />
        <RaisedButton label="Submit" type="submit" value="Submit" style={{marginTop:10}}/>
      </form>
    );
  }
}

export default Login;
