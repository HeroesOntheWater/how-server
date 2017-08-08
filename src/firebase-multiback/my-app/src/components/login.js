import React, {Component} from 'react';
import request from 'superagent';
import createBrowserHistory from 'history/createBrowserHistory';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ApiHandler from '../utils/api_handler';

const history = createBrowserHistory({forceRefresh: true});

const styles = {
    formstyles: {
        marginTop: '30px'
    },
    textFieldstyles: {
        width: '55%',
        margin: '10px'
    },
    textstyles: {
        fontSize: '30px'
    },
    textAreastyles: {
        height: '30px'
    },
    buttonstyles: {
        marginTop: '25',
        width: '200px',
        height: '70px'
    },
    labelstyles: {
        fontSize: '40px',
        lineHeight: '70px'
    },
    overlaystyles: {
        height: '70px'
    },
      fileUpload:{
        container:{
          display:'flex'
        },
        spacer:{
          flexGrow:'1'
        },
        content:{
          flexGrow:'auto'
        }
      }
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            add_config: false
        };
        this.determineView();
    }

    determineView = () => {
        request.get('http://localhost:8080/hasConfig')
          .then((res) => this.setState({add_config: false}),
                (err)=>this.setState({add_config: true}));
    }

    handleUpload = () =>{
      request.post('http://localhost:8080/uploadConfig')
      .then((res) => this.setState({add_config: false}),
                (err)=>this.setState({add_config: true}));
    }

    handleChangeEmail = (event) => {
        this.setState({email: event.target.value});
    }

    handleChangePassword = (event) => {
        this.setState({password: event.target.value});
    }

    handleSubmit = (event) => {
        if (this.state.email === '') {
            alert("Email required");
            return;
        } else if (this.state.password === '') {
            alert("Password required");
            return;
        }

        const url = "http://localhost:8080/login?email=" + this.state.email + "&password=" + this.state.password;
        request.get(url).end((err, res) => {
            if (err) {
                alert("Retry", err);
            } else if (res.body.type === "ERROR") {
                alert(res.body.data.message);
            } else if (res.body.type === "SUCCESS") {
                history.push('/backups/all', {token: res.body.data});
            }
        });
        event.preventDefault();
    }

    render() {
      const state = this.state.add_config;

      let res = null; 
      if(state){
        res = (<form style={styles.formstyles} onSubmit={this.handleSubmit}>
              <div>
                <div style={styles.fileUpload.container}>
                  <div style={styles.fileUpload.spacer}></div>
                  <div style={styles.fileUpload.content}>
                    <input type="file"/>click to add file
                  </div>
                  <div style={styles.fileUpload.spacer}></div>
                </div>
              </div>
              </form>);
      }
      else{
        res = (<form styles={styles.formstyles} onSubmit={this.handleSubmit}>
                <div>
                    <TextField value={this.state.email} onChange={this.handleChangeEmail} hintText="Email" multiLine={true} styles={styles.textFieldstyles} inputstyles={styles.textstyles} textareastyles={styles.textAreastyles} hintstyles={styles.textstyles}/>
                    <br/>
                    <TextField type="password" value={this.state.password} onChange={this.handleChangePassword} hintText="Password" styles={styles.textFieldstyles} inputstyles={styles.textstyles} hintstyles={styles.textstyles}/>
                    <br/>
                    <RaisedButton label="Submit" type="submit" value="Submit" styles={styles.buttonstyles} labelstyles={styles.labelstyles} overlaystyles={styles.overlaystyles}/>
                </div>
              </form>);
      }
       return (
         <div>
          {
            res
          }
         </div>
       )
    }
}

export default Login;
