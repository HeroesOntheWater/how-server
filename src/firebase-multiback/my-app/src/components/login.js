import React, { Component } from 'react';
import request from 'superagent';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      email : '',
      password : '',
      token : ''
    };

    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeEmail(event) {
    this.setState({email : event.target.value});
  }

  handleChangePassword(event) {
    this.setState({password : event.target.value});
  }

  handleSubmit(event) {
    const url = "http://localhost:8080/login?email=" + this.state.email + "&password=" + this.state.password;
    request.get(url)
      .end((err, res) => {
          if (err) {
            alert('Error', err);
          } else {
            this.setState({token : res.body.data})
            alert(res.body.data);
          }
        });
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
        Email:
          <input type="text" value={this.state.email} onChange={this.handleChangeEmail} />
        </label>
        <label>
        Password:
          <input type="text" value={this.state.password} onChange={this.handleChangePassword} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default Login;
