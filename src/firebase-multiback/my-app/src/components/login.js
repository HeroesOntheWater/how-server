import React, { Component } from 'react';
import request from 'superagent';
import createBrowserHistory  from 'history/createBrowserHistory';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const history = createBrowserHistory ({
  forceRefresh: true
});

const style = {
  formStyle: {
    marginTop:'30px'
  },
  textFieldStyle: {
    width: '55%',
    margin:'10px'
  },
  textStyle: {
    fontSize: '30px'
  },
  textAreaStyle: {
    height: '30px'
  },
  buttonStyle: {
    marginTop: 25,
    width: '200px',
    height: '70px'
  },
  labelStyle: {
    fontSize: '40px'
  },
  overlayStyle: {
    height: '50px'
  }
}

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      email : '',
      password : '',
      add_config: false
    };
    this.determineView();
  }

  determineView = () =>{
    request
    .get('http://localhost:8080/hasConfig')
    .end((err, res)=>{
      // if (err || !res.ok) {
      //   alert('Oh no! error');
      // } else {
        (res.body)
          ? this.setState({add_config: false})
          : this.setState({add_config: true})
      // }
    });
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
      <form style={style.formStyle} onSubmit={this.handleSubmit}>
      {
        (this.state.add_config)
        ? (()=>{
            return <div><input type="file"/>click to add file</div>
          })()
        : (()=>{
            return(
              <div>
              <TextField value={this.state.email} onChange={this.handleChangeEmail} hintText="Email" multiLine={true}
              style={style.textFieldStyle} inputStyle={style.textStyle} textareaStyle={style.textAreaStyle} hintStyle={style.textStyle}/>
              <br />
              <TextField type="password" value={this.state.password} onChange={this.handleChangePassword} hintText="Password"
              style={style.textFieldStyle} inputStyle={style.textStyle} hintStyle={style.textStyle}/>
              <br />
              <RaisedButton label="Submit" type="submit" value="Submit" style={style.buttonStyle}
              labelStyle={style.labelStyle} overlayStyle={style.overlayStyle}/>
              </div>
            )
          })()
      }
      </form>
    );
  }
}

export default Login;
